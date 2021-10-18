import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serviceAPIClient } from "@/clients";
import { Box, Spacer, Typography } from "@/design-system";
import {
  TillitConfirmationDocument,
  TillitConfirmationQuery,
  TillitConfirmationQueryVariables,
} from "@/service-api/tillit-confirmation.generated";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const data = await serviceAPIClient.request<
    TillitConfirmationQuery,
    TillitConfirmationQueryVariables
  >(TillitConfirmationDocument, { id: params.orderId as string });
  return { props: { data } };
};

export const ConfirmationTillit = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const order = props.data?.paymentProviders?.tillit?.confirmation;

  if (!order) {
    return (
      <Box css={{ width: "$content", mx: "auto", py: "$16" }}>
        <Typography size={4}>Error</Typography>
      </Box>
    );
  }

  return (
    <Box css={{ width: "$content", mx: "auto", py: "$16" }}>
      <Typography as="h1" variant="heading" size={6}>
        Order Confirmation
      </Typography>

      <Spacer space={4} />

      {order.state === "VERIFIED" ? (
        <Typography size={4}>Thank you for your order!</Typography>
      ) : (
        <Typography size={4}>Order Unverfied</Typography>
      )}
    </Box>
  );
};

export default ConfirmationTillit;