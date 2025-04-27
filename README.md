# Trendlink

## Project Overview
Trendlink is a decentralized platform for crowdsourcing predictions on emerging technologies and ideas, leveraging Clarity's predictability and transparency.

### Key Features
- Decentralized prediction market for crowdsourcing insights on emerging trends
- Transparent and verifiable prediction resolution process
- Robust staking and reward mechanisms to incentivize participation

## Contract Architecture

The core contract for the Trendlink platform is the `prediction-market.clar` contract. This contract provides the following functionality:

### Data Structures
- `market-counter`: A global counter to track the number of prediction markets created.
- `markets`: A mapping of market IDs to market details, including the creator, resolution status, and other metadata.
- `stakes`: A mapping of market IDs to a mapping of principal addresses to their staked amounts.

### Public Functions
- `create-market`: Allows users to create a new prediction market, specifying the market details and initial stakes.
- `stake`: Allows users to stake STX tokens on a prediction market.
- `resolve-market`: Allows the market creator to resolve the prediction outcome and distribute rewards to successful stakers.
- `cancel-market`: Allows the market creator to cancel the market in case of emergency, refunding all stakes.

### Permissions and Authentication
- Only the market creator can resolve or cancel a market.
- Any user can create a new market or stake on an existing market.

### Unique Implementation Details
- The contract includes a version check function to ensure compatibility with the Clarity language version.
- Robust error handling is implemented throughout the contract, with custom error codes defined for various failure scenarios.

## Installation & Setup

To use the Trendlink prediction market contracts, you'll need the following:

- Clarinet: A Clarity smart contract development and testing tool
- Stacks CLI: The official command-line interface for the Stacks blockchain

1. Install Clarinet and the Stacks CLI following the official documentation.
2. Clone the Trendlink repository: `git clone https://github.com/example/trendlink.git`
3. Navigate to the project directory: `cd trendlink`
4. Install project dependencies: `npm install`

## Usage Guide

### Creating a New Prediction Market
1. Call the `create-market` function, providing the market details and initial stakes.
2. The new market will be assigned a unique ID, which can be used for subsequent operations.

### Staking on a Prediction Market
1. Call the `stake` function, providing the market ID and the amount of STX tokens to stake.
2. Your stake will be recorded in the `stakes` mapping for the given market.

### Resolving a Prediction Market
1. The market creator can call the `resolve-market` function, providing the market ID and the outcome.
2. Successful stakers will receive their rewards, and the market will be marked as resolved.

### Canceling a Prediction Market
1. The market creator can call the `cancel-market` function, providing the market ID.
2. All stakes will be refunded, and the market will be marked as canceled.

## Testing

The Trendlink project includes a comprehensive test suite for the `prediction-market.clar` contract, located in the `/workspace/tests/prediction-market_test.ts` file. The tests cover the following scenarios:

- Market creation with valid and invalid parameters
- Staking on markets with different states (open, resolved, canceled)
- Resolving markets with various outcomes
- Canceling markets and refunding stakes
- Error handling for invalid inputs and unauthorized actions

To run the tests, execute the following command:

```
clarinet test
```

## Security Considerations

The Trendlink prediction market contract includes several security measures:

### Permission Structure
- Only the market creator can resolve or cancel a market, ensuring that the outcome can't be manipulated by other users.

### Data Validation
- The contract thoroughly validates all input parameters, throwing custom error codes for invalid values or actions.
- This includes checks for market existence, stake amounts, and authorization.

### Emergency Cancellation
- The `cancel-market` function allows the creator to cancel a market in case of unexpected issues, refunding all stakes.

### Version Compatibility
- The contract includes a version check function to ensure compatibility with the Clarity language version.

## Examples

### Creating a New Prediction Market
```clarity
(contract-call? .prediction-market create-market "Adoption of Web3 technologies" "2023-12-31" 1000 500)
```

This call creates a new prediction market with the specified title, resolution date, and initial stake amounts.

### Staking on a Prediction Market
```clarity
(contract-call? .prediction-market stake 1 200)
```

This call stakes 200 STX tokens on the prediction market with ID 1.

### Resolving a Prediction Market
```clarity
(contract-call? .prediction-market resolve-market 1 true)
```

This call resolves the prediction market with ID 1, marking the outcome as true.

### Canceling a Prediction Market
```clarity
(contract-call? .prediction-market cancel-market 1)
```

This call cancels the prediction market with ID 1, refunding all stakes.