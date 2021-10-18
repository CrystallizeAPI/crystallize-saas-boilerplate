const { callSubscriptionsApi } = require("../utils");
const { createSubscriptionContractInput } = require("./utils");
const { paymentToPaymentInput } = require("../utils");

module.exports = async function createSubscriptionContract(input) {
  const response = await callSubscriptionsApi({
    variables: { input },
    query: `
      mutation createSubscriptionContract($input: CreateSubscriptionContractInput!) {
        subscriptionContracts {
          create(input: $input) {
            id
          }
        }
      }
    `,
  });

  return response.data.subscriptionContracts.create;
};
