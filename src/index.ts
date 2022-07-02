import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  AccountId
} from "@hashgraph/sdk";

import "dotenv/config";

const accountId = process.env.ACCOUNT_ID;
const pk = process.env.PRIVATE_KEY;
let client: Client;

async function initializeClient() {
  client = Client.forTestnet();
  if (accountId == null || pk == null) {
    throw new Error("ENV variables not specified");
  }
  client.setOperator(accountId, pk);
  createWallet();
}

async function createWallet() {
  let newPk = await PrivateKey.generateED25519Async();
  let newPubKey = newPk.publicKey;
  
  let account = await new AccountCreateTransaction()
  .setKey(newPubKey)
  .setInitialBalance(Hbar.fromTinybars(10000))
  .execute(client);

  let receipt = await account.getReceipt(client);
  let newAccountId = receipt.accountId
  console.log("evm address: ", newAccountId?.aliasEvmAddress);
  console.log("solidity address: ", newAccountId?.toSolidityAddress());
  console.log("new account id: ", newAccountId?.toString());

  let balance = await new AccountBalanceQuery().setAccountId(newAccountId!).execute(client);
  console.log("balance : ", balance.toString());
}

async function fundWallet(accountId: AccountId) {
  
}

initializeClient().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});