class Topsis {
  constructor(evaluationMatrix, weightMatrix, criteria, color) {
    this.evaluationMatrix = evaluationMatrix.map((row) =>
      row.map((e) => {
        if (typeof e === "string") {
          return e?.toLowerCase() == color?.toLowerCase() ? 1 : 0;
        }
        return Number(e);
      })
    ); // Convert to float
    this.rowSize = this.evaluationMatrix.length;
    this.columnSize = this.evaluationMatrix[0].length;
    this.weightMatrix = weightMatrix.map(Number);
    this.criteria = criteria
      ? criteria?.map(Number)
      : weightMatrix.map((e) => Number(1));
    this.weightMatrix = this.normalizeWeightMatrix(this.weightMatrix);
  }

  normalizeWeightMatrix(weightMatrix) {
    const sum = weightMatrix.reduce((a, b) => a + b, 0);
    return weightMatrix.map((w) => w / sum);
  }

  normalizeDecisionMatrix() {
    this.normalizedDecision = this.evaluationMatrix.map((row) => row.slice()); // Copy matrix
    const sqrdSum = Array(this.columnSize).fill(0);
    for (let i = 0; i < this.rowSize; i++) {
      for (let j = 0; j < this.columnSize; j++) {
        sqrdSum[j] += this.evaluationMatrix[i][j] ** 2;
      }
    }
    for (let i = 0; i < this.rowSize; i++) {
      for (let j = 0; j < this.columnSize; j++) {
        this.normalizedDecision[i][j] =
          this.evaluationMatrix[i][j] / Math.sqrt(sqrdSum[j]);
        if (isNaN(this.normalizedDecision[i][j]))
          this.normalizedDecision[i][j] = 0;
      }
    }
  }

  weightedNormalizedDecisionMatrix() {
    this.weightedNormalized = this.normalizedDecision.map((row) => row.slice()); // Copy matrix
    for (let i = 0; i < this.rowSize; i++) {
      for (let j = 0; j < this.columnSize; j++) {
        this.weightedNormalized[i][j] *= this.weightMatrix[j];
      }
    }
  }

  determineWorstAndBestAlternatives() {
    this.worstAlternatives = Array(this.columnSize).fill(0);
    this.bestAlternatives = Array(this.columnSize).fill(0);
    for (let i = 0; i < this.columnSize; i++) {
      if (this.criteria[i]) {
        this.worstAlternatives[i] = Math.min(
          ...this.weightedNormalized.map((row) => row[i])
        );
        this.bestAlternatives[i] = Math.max(
          ...this.weightedNormalized.map((row) => row[i])
        );
      } else {
        this.worstAlternatives[i] = Math.max(
          ...this.weightedNormalized.map((row) => row[i])
        );
        this.bestAlternatives[i] = Math.min(
          ...this.weightedNormalized.map((row) => row[i])
        );
      }
    }
  }

  calculateL2Distance() {
    this.worstDistance = Array(this.rowSize).fill(0);
    this.bestDistance = Array(this.rowSize).fill(0);
    this.worstDistanceMatrix = this.weightedNormalized.map((row) =>
      row.slice()
    ); // Copy matrix
    this.bestDistanceMatrix = this.weightedNormalized.map((row) => row.slice()); // Copy matrix

    for (let i = 0; i < this.rowSize; i++) {
      for (let j = 0; j < this.columnSize; j++) {
        this.worstDistanceMatrix[i][j] =
          (this.weightedNormalized[i][j] - this.worstAlternatives[j]) ** 2;
        this.bestDistanceMatrix[i][j] =
          (this.weightedNormalized[i][j] - this.bestAlternatives[j]) ** 2;
        this.worstDistance[i] += this.worstDistanceMatrix[i][j];
        this.bestDistance[i] += this.bestDistanceMatrix[i][j];
      }
      this.worstDistance[i] = Math.sqrt(this.worstDistance[i]);
      this.bestDistance[i] = Math.sqrt(this.bestDistance[i]);
    }
  }

  calculateSimilarity() {
    this.worstSimilarity = Array(this.rowSize).fill(0);
    this.bestSimilarity = Array(this.rowSize).fill(0);

    for (let i = 0; i < this.rowSize; i++) {
      this.worstSimilarity[i] =
        this.worstDistance[i] / (this.worstDistance[i] + this.bestDistance[i]);
      this.bestSimilarity[i] =
        this.bestDistance[i] / (this.worstDistance[i] + this.bestDistance[i]);
    }
  }

  ranking(data) {
    return data.map((value, index) => index + 1);
  }

  rankToWorstSimilarity() {
    return this.ranking(this.worstSimilarity);
  }

  rankToBestSimilarity() {
    return this.ranking(this.bestSimilarity);
  }

  calc() {
    // console.log("Step 1\n", this.evaluationMatrix);
    this.normalizeDecisionMatrix();
    // console.log("Step 2\n", this.normalizedDecision);
    this.weightedNormalizedDecisionMatrix();
    // console.log("Step 3\n", this.weightedNormalized);
    this.determineWorstAndBestAlternatives();
    // console.log("Step 4\n", this.worstAlternatives, this.bestAlternatives);
    this.calculateL2Distance();
    // console.log("Step 5\n", this.worstDistance, this.bestDistance);
    this.calculateSimilarity();
    // console.log("Step 6\n", this.worstSimilarity, this.bestSimilarity);
  }
}

// Example usage
// const evaluationMatrix = [
//   [1, 1, 1, "gray"],
//   [4, 5, 6, "blue"],
//   [1, 1, 1, "red"],
// ];
// const weightMatrix = [0.3, 0.5, 0.1, 0.1];
// const criteria = [true, true, true,true];

// const topsis = new Topsis(evaluationMatrix, weightMatrix, criteria, "blue");
// topsis.calc();
// console.log(topsis);
export { Topsis as performTOPSIS };
