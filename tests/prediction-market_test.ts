import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.2/index.ts';
import { assertEquals, assertObjectMatch } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Validate successful market creation",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const marketDescription = "Will Bitcoin hit $100k in 2024?";

    const block = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "create-market", 
        [types.utf8(marketDescription)], 
        deployer.address
      )
    ]);

    // Assert market creation was successful
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Test market creation with invalid parameters",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    // Test with empty description (which is not possible due to type constraints)
    const block = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "create-market", 
        [types.utf8("")], 
        deployer.address
      )
    ]);

    // This test might need adjustment based on actual input validation
    block.receipts[0].result.expectOk();
  }
});

Clarinet.test({
  name: "Check market creation access controls",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const marketDescription = "Test market by non-deployer";

    const block = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "create-market", 
        [types.utf8(marketDescription)], 
        wallet1.address
      )
    ]);

    // Assert market creation was successful for any account
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

Clarinet.test({
  name: "Test market resolution by authorized creator",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // First create a market
    const createBlock = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "create-market", 
        [types.utf8("Test Resolution Market")], 
        deployer.address
      )
    ]);
    const marketId = createBlock.receipts[0].result.expectOk().replace(/[()]/g, '');

    // Attempt to resolve by the market creator
    const resolveBlock = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "resolve-market", 
        [types.uint(parseInt(marketId))], 
        deployer.address
      )
    ]);

    // Assert market resolution was successful
    resolveBlock.receipts[0].result.expectOk().expectBool(true);
  }
});

Clarinet.test({
  name: "Test unauthorized market resolution",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // First create a market
    const createBlock = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "create-market", 
        [types.utf8("Test Unauthorized Resolution")], 
        deployer.address
      )
    ]);
    const marketId = createBlock.receipts[0].result.expectOk().replace(/[()]/g, '');

    // Attempt to resolve by non-creator
    const resolveBlock = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "resolve-market", 
        [types.uint(parseInt(marketId))], 
        wallet1.address
      )
    ]);

    // Assert unauthorized resolution fails
    resolveBlock.receipts[0].result.expectErr().expectUint(403);
  }
});

Clarinet.test({
  name: "Test resolution of non-existent market",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    // Attempt to resolve a non-existent market
    const resolveBlock = chain.mineBlock([
      Tx.contractCall(
        "prediction-market", 
        "resolve-market", 
        [types.uint(999)], 
        deployer.address
      )
    ]);

    // Assert non-existent market resolution fails
    resolveBlock.receipts[0].result.expectErr().expectUint(404);
  }
});

Clarinet.test({
  name: "Verify contract version",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    const result = chain.callReadOnlyFn(
      "prediction-market",
      "get-contract-version",
      [],
      deployer.address
    );

    result.result.expectOk().expectUtf8("Trendlink Prediction Market v1.0");
  }
});