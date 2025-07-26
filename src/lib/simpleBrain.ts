/**
 * SimpleBrain - A simplified neural network implementation for stock prediction
 * This is a basic implementation that doesn't require native dependencies
 */

// Types for our neural network
export interface TrainingData {
  input: number[];
  output: number[];
}

export interface NetworkConfig {
  hiddenLayers: number[];
  learningRate: number;
  iterations: number;
}

// Activation functions
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = (x: number): number => x * (1 - x);

export class SimpleNeuralNetwork {
  private weights: number[][][];
  private biases: number[][];
  private config: NetworkConfig;
  
  constructor(config: NetworkConfig) {
    this.config = {
      hiddenLayers: config.hiddenLayers || [4],
      learningRate: config.learningRate || 0.1,
      iterations: config.iterations || 1000
    };
    
    this.weights = [];
    this.biases = [];
  }
  
  // Initialize weights and biases with random values
  private initialize(inputSize: number, outputSize: number): void {
    const layers = [inputSize, ...this.config.hiddenLayers, outputSize];
    
    // Initialize weights
    this.weights = [];
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights = [];
      for (let j = 0; j < layers[i + 1]; j++) {
        const neuronWeights = [];
        for (let k = 0; k < layers[i]; k++) {
          // Random weights between -0.5 and 0.5
          neuronWeights.push(Math.random() - 0.5);
        }
        layerWeights.push(neuronWeights);
      }
      this.weights.push(layerWeights);
    }
    
    // Initialize biases
    this.biases = [];
    for (let i = 0; i < layers.length - 1; i++) {
      const layerBiases = [];
      for (let j = 0; j < layers[i + 1]; j++) {
        // Random biases between -0.5 and 0.5
        layerBiases.push(Math.random() - 0.5);
      }
      this.biases.push(layerBiases);
    }
  }
  
  // Forward pass through the network
  private forward(input: number[]): number[][] {
    const activations = [input];
    
    // For each layer
    for (let i = 0; i < this.weights.length; i++) {
      const layerActivations = [];
      
      // For each neuron in the layer
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        
        // For each input to the neuron
        for (let k = 0; k < this.weights[i][j].length; k++) {
          sum += this.weights[i][j][k] * activations[i][k];
        }
        
        // Apply activation function
        layerActivations.push(sigmoid(sum));
      }
      
      activations.push(layerActivations);
    }
    
    return activations;
  }
  
  // Train the network
  public train(trainingData: TrainingData[]): void {
    if (trainingData.length === 0) {
      throw new Error('No training data provided');
    }
    
    const inputSize = trainingData[0].input.length;
    const outputSize = trainingData[0].output.length;
    
    // Initialize weights and biases
    this.initialize(inputSize, outputSize);
    
    // Train for the specified number of iterations
    for (let iter = 0; iter < this.config.iterations; iter++) {
      let totalError = 0;
      
      // For each training example
      for (let t = 0; t < trainingData.length; t++) {
        const { input, output: target } = trainingData[t];
        
        // Forward pass
        const activations = this.forward(input);
        const prediction = activations[activations.length - 1];
        
        // Calculate error
        let error = 0;
        for (let i = 0; i < target.length; i++) {
          error += Math.pow(target[i] - prediction[i], 2);
        }
        totalError += error;
        
        // Backpropagation
        // Calculate output layer error
        const outputDeltas = [];
        for (let i = 0; i < prediction.length; i++) {
          const delta = (target[i] - prediction[i]) * sigmoidDerivative(prediction[i]);
          outputDeltas.push(delta);
        }
        
        // Calculate hidden layer errors (simplified)
        const deltas = [outputDeltas];
        for (let i = this.weights.length - 1; i > 0; i--) {
          const layerDeltas = [];
          for (let j = 0; j < this.weights[i - 1].length; j++) {
            let delta = 0;
            for (let k = 0; k < this.weights[i].length; k++) {
              delta += this.weights[i][k][j] * deltas[0][k];
            }
            delta *= sigmoidDerivative(activations[i][j]);
            layerDeltas.push(delta);
          }
          deltas.unshift(layerDeltas);
        }
        
        // Update weights and biases
        for (let i = 0; i < this.weights.length; i++) {
          for (let j = 0; j < this.weights[i].length; j++) {
            for (let k = 0; k < this.weights[i][j].length; k++) {
              this.weights[i][j][k] += this.config.learningRate * deltas[i][j] * activations[i][k];
            }
            this.biases[i][j] += this.config.learningRate * deltas[i][j];
          }
        }
      }
      
      // Log progress every 100 iterations
      if (iter % 100 === 0) {
        console.log(`Iteration ${iter}, Error: ${totalError / trainingData.length}`);
      }
    }
  }
  
  // Run the network on an input
  public run(input: number[]): number[] {
    const activations = this.forward(input);
    return activations[activations.length - 1];
  }
}

// Stock predictor class that uses our simple neural network
export class StockPredictor {
  private network: SimpleNeuralNetwork;
  private normalizedData: { 
    min: number; 
    max: number; 
    data: number[][];
  } | null = null;
  private lookback: number = 5; // Simplified: Number of days to look back
  private daysToPredict: number = 5; // Number of days to predict

  constructor() {
    this.network = new SimpleNeuralNetwork({
      hiddenLayers: [8, 4], // Simplified network architecture
      learningRate: 0.1,
      iterations: 1000
    });
  }

  // Normalize data between 0 and 1
  private normalizeData(data: any[]): { min: number; max: number; data: number[][] } {
    const closePrices = data.map(item => item.close);
    
    // Calculate min/max
    const min = Math.min(...closePrices);
    const max = Math.max(...closePrices);
    const range = max - min || 1; // Prevent division by zero
    
    // Normalize prices to be between 0 and 1
    const normalizedPrices = closePrices.map(price => (price - min) / range);
    
    // Create sequences for lookback window
    const sequences: number[][] = [];
    for (let i = 0; i <= normalizedPrices.length - this.lookback; i++) {
      const sequence = [];
      for (let j = 0; j < this.lookback; j++) {
        sequence.push(normalizedPrices[i + j]);
      }
      sequences.push(sequence);
    }

    return { min, max, data: sequences };
  }

  // Denormalize data back to original scale
  private denormalizeData(normalizedValue: number, min: number, max: number): number {
    return normalizedValue * (max - min) + min;
  }

  // Prepare training data
  private prepareTrainingData(normalizedData: number[][]): TrainingData[] {
    const trainingData: TrainingData[] = [];

    for (let i = 0; i < normalizedData.length - 1; i++) {
      trainingData.push({
        input: normalizedData[i],
        output: [normalizedData[i + 1][0]], // Predict next day's close price
      });
    }

    return trainingData;
  }

  // Train the neural network
  public train(stockData: any[]): void {
    if (stockData.length < this.lookback + 1) {
      throw new Error(`Not enough data points. Need at least ${this.lookback + 1} data points.`);
    }

    this.normalizedData = this.normalizeData(stockData);
    const trainingData = this.prepareTrainingData(this.normalizedData.data);

    this.network.train(trainingData);
  }

  // Predict future stock prices
  public predict(stockData: any[]): { date: string; predictedClose: number }[] {
    if (!this.normalizedData) {
      throw new Error('Neural network has not been trained yet.');
    }

    const predictions: { date: string; predictedClose: number }[] = [];
    let lastSequence = this.normalizedData.data[this.normalizedData.data.length - 1];
    const lastDate = new Date(stockData[stockData.length - 1].date);
    
    for (let i = 1; i <= this.daysToPredict; i++) {
      // Run the prediction
      const output = this.network.run(lastSequence);
      const predictedNormalized = output[0];
      
      // Denormalize the prediction
      const predictedClose = this.denormalizeData(
        predictedNormalized,
        this.normalizedData.min,
        this.normalizedData.max
      );

      // Calculate the next date (skip weekends)
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      
      const dateString = nextDate.toISOString().split('T')[0];
      
      // Add the prediction
      predictions.push({
        date: dateString,
        predictedClose: Number(predictedClose.toFixed(2)),
      });

      // Update lastSequence for next prediction by shifting and adding new prediction
      lastSequence = [...lastSequence.slice(1), predictedNormalized];
    }

    return predictions;
  }

  // Calculate prediction accuracy using Mean Absolute Percentage Error (MAPE)
  public calculateAccuracy(actualData: any[], predictedData: { date: string; predictedClose: number }[]): number {
    if (actualData.length === 0 || predictedData.length === 0) {
      return 0;
    }

    // Create a map of actual data by date for easy lookup
    const actualMap = new Map<string, number>();
    actualData.forEach(item => {
      actualMap.set(item.date, item.close);
    });

    // Calculate the absolute percentage error for each prediction that has actual data
    let totalError = 0;
    let count = 0;

    predictedData.forEach(prediction => {
      const actual = actualMap.get(prediction.date);
      if (actual !== undefined) {
        const error = Math.abs((actual - prediction.predictedClose) / actual);
        totalError += error;
        count++;
      }
    });

    // Return the mean absolute percentage error (lower is better)
    return count > 0 ? (1 - totalError / count) * 100 : 0;
  }
} 