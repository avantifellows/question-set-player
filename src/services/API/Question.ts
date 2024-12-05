import { apiClient } from "./RootClient";
import { questionsEndpoint } from "./Endpoints";
import { Question } from "@/types";

/**
 * Shuffles the order of questions in an array
 * @param {Array} array - The array to be shuffled
 * @returns {Array} shuffled array
 */
const shuffleArray = (array: any) => {
  return array.sort(() => Math.random() - 0.5); // Simple random shuffle
};

export default {
  /**
   * Returns the list of questions belonging to a question set, with optional shuffling
   * @param {string} questionSetId - uuid of the question set
   * @param {number | undefined} skip - skip a number of records
   * @param {number | undefined} limit - limit the returned number of records
   * @param {string} linear - Linear key from Quiz JSON (can be 'jumble' or other value)
   * @returns {Promise<QuizResponse>} a list of questions
   */
  async getQuestions(
    questionSetId: string,
    skip: number | undefined = undefined,
    limit: number | undefined = undefined,
    linear: string = "linear" // Default is "linear", or can be passed as 'jumble'
  ): Promise<Question[]> {
    type queryParamsType = {
      question_set_id: string;
      skip?: number;
      limit?: number;
      linear: string;
    };

    const queryParams: queryParamsType = {
      question_set_id: questionSetId,
      linear: linear, // Pass linear key for jumbling or not
    };

    if (skip != undefined) queryParams.skip = skip;
    if (limit != undefined) queryParams.limit = limit;

    const response = await apiClient().get(questionsEndpoint, {
      params: queryParams,
    });

    let questions = response.data;

    // If 'linear' is 'jumble', shuffle the questions
    if (linear === "jumble") {
      questions = shuffleArray(questions);  // Shuffle questions if linear is "jumble"
    }

    return questions;
  },
};