import { flushPromises, mount } from "@vue/test-utils";
import { Question, SubmittedResponse } from "@/types";
import QuestionModal from "@/components/Questions/QuestionModal.vue";

let clonedeep = require("lodash.clonedeep");

describe("QuestionModal.vue", () => {
  const questions = [
    {
      _id: "1234",
      type: "single-choice",
      text: "abcd",
      options: [
        {
          text: "option 1",
        },
        {
          text: "option 2",
        },
      ],
      correct_answer: [0],
      image: null,
      graded: false,
      max_char_limit: null,
    },
    {
      _id: "1235",
      type: "multi-choice",
      text: "efgh",
      options: [
        {
          text: "option 1",
        },
        {
          text: "option 2",
        },
        {
          text: "op3",
        },
        {
          text: "option 4",
        },
      ],
      correct_answer: [2, 3],
      image: null,
      graded: false,
      max_char_limit: null,
    },
    {
      _id: "1236",
      type: "subjective",
      text: "yolo",
      options: null,
      correct_answer: null,
      image: null,
      graded: false,
      max_char_limit: 100,
    },
  ] as Question[];

  let responses: SubmittedResponse[] = [];
  questions.forEach((question, index) =>
    responses.push({
      _id: index.toString(),
      question_id: question._id,
      answer: null,
    })
  );

  let wrapper: any;
  const mountWrapper = async (
    params = {
      currentQuestionIndex: 0,
    }
  ) => {
    if (wrapper != undefined) wrapper.unmount();
    wrapper = mount(QuestionModal, {
      props: {
        questions: questions,
        responses: clonedeep(responses),
        currentQuestionIndex: params.currentQuestionIndex,
      },
    });
  };

  beforeEach(() => mountWrapper());

  it("should render with required values", () => {
    expect(wrapper).toBeTruthy();
  });

  describe("basic checks", () => {
    it("should prepare draft responses for each question", () => {
      expect(wrapper.vm.draftResponses.length).toBe(questions.length);
    });

    it("moves to previous question when previous button clicked", async () => {
      await wrapper.setProps({
        currentQuestionIndex: 1,
      });
      wrapper
        .find('[data-test="footer"]')
        .find('[data-test="previousQuestionButton"]')
        .trigger("click");

      expect(wrapper.vm.localCurrentQuestionIndex).toBe(0);
    });
  });

  describe("single-choice questions", () => {
    const questionIndex = 0;
    it("selecting option makes answer valid", async () => {
      // initially answer should be invalid
      expect(wrapper.vm.isAttemptValid).toBeFalsy();

      // select an option
      await wrapper.find('[data-test="option-0"]').trigger("click");

      // the answer should now be valid
      expect(wrapper.vm.isAttemptValid).toBeTruthy();
    });

    describe("submits question", () => {
      beforeEach(async () => {
        await mountWrapper();

        // select an option
        wrapper
          .find('[data-test="body"]')
          .find('[data-test="option-0"]')
          .trigger("click");

        await flushPromises();

        // submit the answer
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");
      });

      it("responses have been updated", () => {
        expect(wrapper.vm.localResponses[questionIndex]).toEqual({
          _id: `${questionIndex}`,
          question_id: questions[questionIndex]._id,
          answer: [0],
        });
        expect(wrapper.emitted()).toHaveProperty("submit-question");
      });

      it("proceeds with question on answering", () => {
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");

        expect(wrapper.vm.localCurrentQuestionIndex).toBe(1);
      });
    });
  });

  describe("multi-choice questions", () => {
    const questionIndex = 1;

    beforeEach(() => mountWrapper({ currentQuestionIndex: questionIndex }));

    it("selecting option makes answer valid", async () => {
      // initially answer should be invalid
      expect(wrapper.vm.isAttemptValid).toBeFalsy();

      // select an option
      await wrapper.find('[data-test="option-0"]').trigger("click");

      // the answer should now be valid
      expect(wrapper.vm.isAttemptValid).toBeTruthy();
    });

    it("unselecting all options makes the answer invalid", async () => {
      // select an option
      await wrapper.find('[data-test="option-0"]').trigger("click");
      // select another option
      await wrapper.find('[data-test="option-1"]').trigger("click");

      // unselect an option
      await wrapper.find('[data-test="option-0"]').trigger("click");
      // the answer should still be valid
      expect(wrapper.vm.isAttemptValid).toBeTruthy();

      // unselect the other option
      await wrapper.find('[data-test="option-1"]').trigger("click");
      // the answer should now be invalid
      expect(wrapper.vm.isAttemptValid).toBeFalsy();
    });

    describe("submits question", () => {
      beforeEach(async () => {
        await mountWrapper({ currentQuestionIndex: questionIndex });

        // select options
        const body = wrapper.find('[data-test="body"]');
        await body.find('[data-test="optionSelector-0"]').trigger("click");
        await body.find('[data-test="optionSelector-1"]').trigger("click");

        await flushPromises();

        // submit the answer
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");
      });

      it("responses have been updated", () => {
        expect(wrapper.vm.localResponses[questionIndex]).toEqual({
          _id: `${questionIndex}`,
          question_id: questions[questionIndex]._id,
          answer: [0, 1],
        });
        expect(wrapper.emitted()).toHaveProperty("submit-question");
      });

      it("proceeds with question on answering", () => {
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");

        expect(wrapper.vm.localCurrentQuestionIndex).toBe(2);
      });
    });
  });

  describe("subjective questions", () => {
    const questionIndex = 2;

    beforeEach(() => mountWrapper({ currentQuestionIndex: questionIndex }));

    it("entering answer makes answer valid", async () => {
      // initially answer should be invalid
      expect(wrapper.vm.isAttemptValid).toBeFalsy();

      // select an option
      await wrapper.find('[data-test="input"]').setValue("abcd");

      // the answer should now be valid
      expect(wrapper.vm.isAttemptValid).toBeTruthy();
    });

    describe("submits question", () => {
      const answer = "abcd";
      beforeEach(async () => {
        await mountWrapper({ currentQuestionIndex: questionIndex });

        // enter answer
        await wrapper.find('[data-test="input"]').setValue(answer);

        // submit the answer
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");
      });

      it("responses have been updated", () => {
        expect(wrapper.vm.localResponses[questionIndex]).toEqual({
          _id: `${questionIndex}`,
          question_id: questions[questionIndex]._id,
          answer: answer,
        });
        expect(wrapper.emitted()).toHaveProperty("submit-question");
      });

      it("proceeds with question on answering", () => {
        wrapper
          .find('[data-test="footer"]')
          .find('[data-test="submitButton"]')
          .trigger("click");

        expect(wrapper.vm.localCurrentQuestionIndex).toBe(3);
      });
    });
  });
});
