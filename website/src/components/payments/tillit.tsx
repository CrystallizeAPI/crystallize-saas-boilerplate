import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { serviceAPIClient } from "@/clients";
import {
  Box,
  Button,
  Flex,
  Spacer,
  TextField,
  Typography,
} from "@/design-system";
import { TillitCompany } from "@/service-api/types.generated";
import {
  TillitSearchDocument,
  TillitSearchQuery,
  TillitSearchQueryVariables,
} from "@/service-api/tillit-search.generated";
import {
  TillitCheckoutDocument,
  TillitCheckoutMutation,
  TillitCheckoutMutationVariables,
} from "@/service-api/tillit-checkout.generated";

import { PaymentProps } from "./types";

export const Tillit = ({ checkoutModel, onError }: PaymentProps) => {
  const [company, setCompany] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<TillitCompany>(null);
  const [phone, setPhone] = useState("");

  const companies = useQuery(
    "companies",
    async () => {
      const data = await serviceAPIClient.request<
        TillitSearchQuery,
        TillitSearchQueryVariables
      >(TillitSearchDocument, {
        searchTerm: company,
        locale: checkoutModel.basketModel.locale,
      });
      return data.paymentProviders.tillit.search.data || [];
    },
    { enabled: false, retry: 0 }
  );

  function searchCompany(e) {
    e.preventDefault();

    setSelectedCompany(null);
    companies.refetch();
  }

  const pay = useMutation(async () => {
    try {
      const data = await serviceAPIClient.request<
        TillitCheckoutMutation,
        TillitCheckoutMutationVariables
      >(TillitCheckoutDocument, {
        checkoutModel,
        tillitInput: { company: selectedCompany, phone },
        baseUrl: `${location.protocol}//${location.host}`,
      });
      if (!data.paymentProviders.tillit.checkout.success) throw new Error();
      return data.paymentProviders.tillit.checkout.paymentUrl;
    } catch (error) {
      const thrownError = new Error("Error checking out with Tillit");
      onError?.(thrownError);
      throw thrownError;
    }
  });

  function onPay(e) {
    e.preventDefault();

    pay.mutate();
  }

  if (pay.data) {
    return (
      <>
        <Typography as="p" size={4}>
          Success
        </Typography>
        <Spacer space={2} />
        <Button
          as="a"
          href={pay.data}
          target="__blank"
          rel="noopener noreferrer"
        >
          Pay Invoice at Tillit
        </Button>
      </>
    );
  }

  return (
    <>
      <Box css={{ width: "$full" }} as="form" onSubmit={searchCompany}>
        <Flex>
          <TextField
            placeholder="Company"
            cssForWrapper={{ flex: "1" }}
            value={company}
            onChange={(e) => setCompany(e.currentTarget.value)}
          />

          <Spacer direction="horizontal" space={2} />

          <Button variant="secondary" type="submit" css={{ minWidth: "150px" }}>
            {companies.isFetching ? "Searching..." : "Search"}
          </Button>
        </Flex>
      </Box>

      <Box as="form" onSubmit={onPay} css={{ width: "$full" }}>
        {companies.data?.length > 0 && (
          <>
            <Spacer space={5} />

            <Flex
              direction="column"
              align="start"
              css={{ width: "$full", gap: "$2" }}
            >
              {companies.data.map((company) => (
                <Flex key={company.id} as="label" align="center">
                  <input
                    type="radio"
                    name="selectedCompany"
                    onChange={() => setSelectedCompany(company)}
                    checked={company.id === selectedCompany?.id}
                    required
                  />
                  <Spacer direction="horizontal" space={2} />
                  <Typography
                    as="span"
                    variant="text"
                    size={2}
                    css={{ textAlign: "left" }}
                  >
                    {company.name}
                  </Typography>
                </Flex>
              ))}
            </Flex>
          </>
        )}

        <Spacer space={5} />

        <TextField
          placeholder="Phone Number"
          cssForWrapper={{ width: "$full" }}
          required
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
        />

        <Spacer space={5} />

        {pay.isError ? (
          <>
            <Typography
              size={4}
              css={{ width: "$full", color: "$error", textAlign: "left" }}
            >
              {(pay.error as Error)?.message}
            </Typography>
            <Spacer space={5} />
          </>
        ) : null}

        <Button css={{ width: "$full" }} type="submit">
          {pay.status === "loading" ? "Paying..." : "Pay"}
        </Button>
      </Box>
    </>
  );
};
