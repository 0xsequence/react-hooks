import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/hello", () => {
    return HttpResponse.text("ok", { status: 200 });
  }),

  http.post("*/GetNativeTokenBalance", async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        balance: {
          accountAddress: body.accountAddress,
          balance: "158495082541645504",
        },
      },
      { status: 200 }
    );
  }),

  http.post("*/GetTokenBalancesSummary", async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        page: {
          page: 1,
        },
        balances: [
          {
            contractType: "ERC721",
            contractAddress: "0x0000000000000000000000000000000000000000",
            accountAddress: body.accountAddress,
            tokenID: "1",
            balance: "1",
            blockHash:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1,
            chainId: 1,
            uniqueCollectibles: "1",
            isSummary: true,
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.post("*/GetTokenBalancesDetails", async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        page: {
          page: 1,
        },
        balances: [
          {
            contractType: "ERC721",
            contractAddress: "0x0000000000000000000000000000000000000000",
            accountAddress: body.accountAddress,
            tokenID: "1",
            balance: "1",
            blockHash:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1,
            chainId: 1,
            uniqueCollectibles: "1",
            isSummary: true,
          },
        ],
      },
      { status: 200 }
    );
  }),

  http.post("*/GetTokenBalancesByContract", async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json(
      {
        page: {
          page: 1,
        },
        balances: [
          {
            contractType: "ERC721",
            contractAddress: "0x0000000000000000000000000000000000000000",
            accountAddress: body.accountAddress,
            tokenID: "1",
            balance: "1",
            blockHash:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1,
            chainId: 1,
            uniqueCollectibles: "1",
            isSummary: true,
          },
        ],
      },
      { status: 200 }
    );
  }),
];
