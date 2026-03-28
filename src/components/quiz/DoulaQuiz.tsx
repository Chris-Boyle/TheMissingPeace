"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveDoulaQuizResult } from "@/lib/quiz-storage";
import { QuizIntro } from "./QuizIntro";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestionStep } from "./QuizQuestionStep";
import { QuizResult } from "./QuizResult";

type QuizBucket = "high-support" | "moderate-support" | "exploratory";

type QuizQuestion = {
  id: string;
  title: string;
  description?: string;
  isMultiSelect?: boolean;
  options: Array<{
    label: string;
    value: string;
    weight: number;
  }>;
};

type QuizAnswers = Record<string, string[]>;

type QuizResultContent = {
  bucket: QuizBucket;
  headline: string;
  explanation: string[];
  supportingPoints: string[];
};

const questions: QuizQuestion[] = [
  {
    id: "birth-feeling",
    title: "How are you feeling about your upcoming birth?",
    options: [
      { label: "Excited and confident", value: "confident", weight: 0 },
      { label: "A little unsure", value: "unsure", weight: 1 },
      { label: "Overwhelmed and anxious", value: "anxious", weight: 3 },
      { label: "I’m not sure what to expect", value: "not-sure", weight: 2 },
    ],
  },
  {
    id: "current-support",
    title: "How much support do you currently have for your birth?",
    options: [
      {
        label: "Strong support (partner/family + provider)",
        value: "strong",
        weight: 0,
      },
      {
        label: "Some support, but I still have questions",
        value: "some",
        weight: 1,
      },
      { label: "Limited support", value: "limited", weight: 3 },
      { label: "Not sure yet", value: "not-sure", weight: 2 },
    ],
  },
  {
    id: "birth-priorities",
    title: "What matters most to you during birth?",
    description: "Choose all that fit.",
    isMultiSelect: true,
    options: [
      {
        label: "Feeling calm and supported",
        value: "calm-and-supported",
        weight: 1,
      },
      {
        label: "Understanding my options",
        value: "understanding-options",
        weight: 1,
      },
      {
        label: "Having someone advocate for me",
        value: "advocacy",
        weight: 2,
      },
      {
        label: "Avoiding unnecessary interventions",
        value: "avoid-interventions",
        weight: 1,
      },
      {
        label: "Having a flexible plan",
        value: "flexible-plan",
        weight: 1,
      },
    ],
  },
  {
    id: "labor-decisions",
    title: "How do you feel about making decisions during labor?",
    options: [
      { label: "I feel confident", value: "confident", weight: 0 },
      {
        label: "I’d like guidance and explanation",
        value: "guidance",
        weight: 2,
      },
      {
        label: "I’d prefer someone to help advocate for me",
        value: "advocacy",
        weight: 3,
      },
      { label: "I’m unsure", value: "unsure", weight: 2 },
    ],
  },
  {
    id: "birth-plan-status",
    title: "Have you created a birth plan yet?",
    options: [
      {
        label: "Yes, and I feel good about it",
        value: "ready",
        weight: 0,
      },
      { label: "I’ve started one", value: "started", weight: 1 },
      { label: "Not yet", value: "not-yet", weight: 2 },
      { label: "I don’t know where to start", value: "stuck", weight: 3 },
    ],
  },
  {
    id: "helpful-support",
    title: "What kind of support would feel most helpful to you?",
    options: [
      { label: "Emotional reassurance", value: "emotional", weight: 1 },
      { label: "Education and preparation", value: "education", weight: 1 },
      {
        label: "Physical comfort during labor",
        value: "physical",
        weight: 1,
      },
      {
        label: "Help navigating decisions",
        value: "decisions",
        weight: 2,
      },
      { label: "All of the above", value: "all", weight: 3 },
    ],
  },
];

const resultContent: Record<QuizBucket, QuizResultContent> = {
  "high-support": {
    bucket: "high-support",
    headline: "You’d really benefit from having a doula by your side",
    explanation: [
      "Based on what you shared, having steady guidance and reassurance during pregnancy and birth would likely make a meaningful difference.",
      "A doula can help you feel less alone in the unknowns, bring calm to decision points, and support you in creating a birth experience that feels more grounded and informed.",
    ],
    supportingPoints: [
      "Emotional support that helps you feel calmer and more reassured",
      "Education so you understand your options before labor begins",
      "Advocacy support when decisions feel heavy or unclear",
      "Preparation for labor, comfort measures, and flexible planning",
    ],
  },
  "moderate-support": {
    bucket: "moderate-support",
    headline: "A doula could help you feel more confident and supported",
    explanation: [
      "You may already have some support in place, but there are still places where extra guidance could bring more peace of mind.",
      "A doula can help you prepare thoughtfully, ask better questions, and feel more steady during labor without adding pressure or complexity.",
    ],
    supportingPoints: [
      "Emotional support that keeps you centered when plans shift",
      "Education to strengthen your confidence before birth",
      "Advocacy that helps your preferences stay visible",
      "Preparation for your birth plan and labor support strategies",
    ],
  },
  exploratory: {
    bucket: "exploratory",
    headline: "Even if you’re still figuring things out, support can help",
    explanation: [
      "You do not need to have everything decided to benefit from doula care. Many families start with questions, curiosity, or a sense that they want a steadier plan.",
      "A doula can offer a calm place to sort through your options, think about what matters most to you, and prepare at your own pace.",
    ],
    supportingPoints: [
      "Emotional support that makes the process feel less overwhelming",
      "Education to help you understand what birth support can look like",
      "Advocacy planning so you know how your voice can stay centered",
      "Preparation through guided conversations and a clear birth plan",
    ],
  },
};

function getSelectedValue(answers: QuizAnswers, questionId: string) {
  return answers[questionId]?.[0];
}

function calculateResult(answers: QuizAnswers) {
  const totalScore = questions.reduce((score, question) => {
    const selectedValues = answers[question.id] ?? [];
    const questionScore = selectedValues.reduce((questionTotal, value) => {
      const option = question.options.find((currentOption) => currentOption.value === value);
      return questionTotal + (option?.weight ?? 0);
    }, 0);

    return score + questionScore;
  }, 0);

  const hasHighNeedSignals =
    getSelectedValue(answers, "birth-feeling") === "anxious" ||
    getSelectedValue(answers, "current-support") === "limited" ||
    getSelectedValue(answers, "labor-decisions") === "advocacy" ||
    getSelectedValue(answers, "birth-plan-status") === "stuck";

  const hasMostlyUnsureSignals =
    getSelectedValue(answers, "birth-feeling") === "not-sure" ||
    getSelectedValue(answers, "current-support") === "not-sure" ||
    getSelectedValue(answers, "labor-decisions") === "unsure";

  if (hasHighNeedSignals || totalScore >= 9) {
    return resultContent["high-support"];
  }

  if (totalScore >= 5) {
    return resultContent["moderate-support"];
  }

  if (hasMostlyUnsureSignals) {
    return resultContent.exploratory;
  }

  return resultContent["moderate-support"];
}

function createEmptyAnswers() {
  return questions.reduce<QuizAnswers>((accumulator, question) => {
    accumulator[question.id] = [];
    return accumulator;
  }, {});
}

export function DoulaQuiz() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(createEmptyAnswers);
  const sectionRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentStep];

  const result = useMemo(() => {
    if (!hasStarted || currentStep < questions.length) {
      return null;
    }

    return calculateResult(answers);
  }, [answers, currentStep, hasStarted]);

  useEffect(() => {
    if (!result) {
      return;
    }

    saveDoulaQuizResult({
      answers,
      resultKey: result.bucket,
      resultHeadline: result.headline,
      resultSummary: result.explanation[0] ?? "",
      completedAt: new Date().toISOString(),
    });
  }, [answers, result]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    window.setTimeout(() => {
      experienceRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }, [currentStep, hasStarted]);

  function startQuiz() {
    setHasStarted(true);
    setCurrentStep(0);

    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function updateAnswer(questionId: string, nextValues: string[]) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: nextValues,
    }));
  }

  function goToNextStep() {
    setCurrentStep((step) => Math.min(step + 1, questions.length));
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  function resetQuiz() {
    setAnswers(createEmptyAnswers());
    setCurrentStep(0);
    setHasStarted(true);

    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  return (
    <section
      ref={sectionRef}
      id="doula-quiz"
      className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      aria-labelledby="doula-quiz-heading"
    >
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_24px_60px_rgba(109,75,54,0.08)] lg:p-10">
        <QuizIntro isStarted={hasStarted} onStart={startQuiz} />

        {hasStarted ? (
          <div
            ref={experienceRef}
            className="mt-10 border-t border-[#eadfd1] pt-8"
          >
            {result ? (
              <QuizResult result={result} onRetake={resetQuiz} />
            ) : (
              <div className="space-y-6">
                <QuizProgress
                  currentStep={currentStep + 1}
                  totalSteps={questions.length}
                />
                <div className="transition-opacity duration-300 ease-out">
                  <QuizQuestionStep
                    key={currentQuestion.id}
                    questionId={currentQuestion.id}
                    title={currentQuestion.title}
                    description={currentQuestion.description}
                    options={currentQuestion.options}
                    isMultiSelect={currentQuestion.isMultiSelect}
                    selectedValues={answers[currentQuestion.id]}
                    onChange={(nextValues) =>
                      updateAnswer(currentQuestion.id, nextValues)
                    }
                    onNext={goToNextStep}
                    onBack={goToPreviousStep}
                    isFirstStep={currentStep === 0}
                    isLastStep={currentStep === questions.length - 1}
                  />
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
