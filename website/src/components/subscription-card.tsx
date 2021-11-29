import { FC } from "react";

import { Box, Spacer, Button, Typography, Flex } from "@/design-system";
import { CheckIcon } from "@radix-ui/react-icons";
import { Plan } from "@/types/basket";
import { ProductPriceVariant } from "@/crystallize/types.generated";
import { PriceVariant } from "@/components/price-variant";

interface SubscriptionInterface {
  name: string;
  price: ProductPriceVariant;
  isActive?: boolean;
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export const SubscriptionCard: FC<SubscriptionInterface> = ({
  name,
  price,
  isActive = false,
  plan,
  onSelect,
}) => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        boxShadow: "$card",
        borderRadius: "$3xl",
        p: "$3",
        backgroundColor: isActive ? "$primary" : "initial",

        "& [data-card-text]": {
          opacity: 0.7,
          textAlign: "center",
        },

        "& [data-card-price]": {
          textAlign: "center",
        },

        "& [data-card-text-active=true]": {
          opacity: 1,
          color: "$white",
        },
      }}
    >
      <Flex justify="start" css={{ width: "$full" }}>
        <Box
          css={{
            backgroundColor: "$white",
            borderStyle: "solid",
            borderWidth: "thin",
            borderRadius: "50%",
            borderColor: "$grey",
            width: isActive ? "$6" : "$6",
            height: isActive ? "$6" : "$6",
          }}
        >
          {isActive && <CheckIcon width="20" height="20" />}
        </Box>
      </Flex>

      <Spacer space={2} />

      <Typography
        variant="text"
        size="4"
        data-card-text
        data-card-text-active={isActive}
      >
        {name}
      </Typography>

      <Spacer space={6} />

      <Typography
        variant="heading"
        size="7"
        data-card-price
        data-card-text-active={isActive}
      >
        {!price.price ? (
          "Free"
        ) : (
          <>
            <PriceVariant {...price} />
            <Typography
              variant="heading"
              size="5"
              data-card-price
              data-card-text-active={isActive}
            >
              /month
            </Typography>
          </>
        )}
      </Typography>

      <Spacer space={5} />

      <Typography
        as="p"
        variant="text"
        size="2"
        css={{ lineHeight: "$relaxed" }}
        data-card-text
        data-card-text-active={isActive}
      >
        TODO: Full access to library.
        <br /> 50 downloads / month
        <br />3 users
      </Typography>

      <Spacer space={9} />

      <Button
        variant="primary"
        on={isActive ? "primary" : "default"}
        disabled={isActive}
        css={{ width: "$full", ...(isActive ? { color: "$black" } : {}) }}
        onClick={() => onSelect(plan)}
      >
        {isActive ? "Selected Plan" : "Choose Plan"}
      </Button>

      <Spacer space={isActive ? 2 : 0} />
    </Box>
  );
};
