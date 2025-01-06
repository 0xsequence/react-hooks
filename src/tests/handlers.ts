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
];
