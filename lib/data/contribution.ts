import { publicApiUrl } from "../../services/config";
import {
  ContributionByInvestorResponse,
  ContributionRequest,
  CreateContributionWithPaymentResponse,
} from "../definitions";
// import fetchCookie from "../utils/fetch-cookie";
// import { fetchData } from "../utils/fetch-data"; // TODO: candiadate to refaactor

//TODO: add types when paymentGatway is ready
export async function fetchContributionInvest(
  payload: ContributionRequest,
): Promise<CreateContributionWithPaymentResponse | undefined> {
  try {
    const formData = new FormData();
    formData.append("projectId", payload.projectId.toString());
    formData.append("amount", payload.amount.toString());
    formData.append("method", payload.method);
    formData.append("qtyActionsBuy", payload.qtyActionsBuy.toString());
    formData.append("invoiceFile", payload.invoiceFile);

    const response = await fetch(
      `/api/contribution?projectId=${payload.projectId}`,
      {
        method: "POST",
        body: formData,
      },
    );

    console.log("response", response);
    const resToJson = await response.json();
    console.log("resToJson", resToJson);

    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.statusText}. ${resToJson.message} `,
      );
    }
    return resToJson.data; //expexted data: {contribution:{}, payment:{}, project:{}}
  } catch (error) {
    throw error;
  }
}

//  currency: "USD",
//  investment_horizon: "long_term",
//  risk_tolerance: "high",
//  investment_goals: ["retirement", "wealth_building"],
//  tax_optimization: true,

export async function fetch_getContributionsByInvestor(
  userId: number,
): Promise<ContributionByInvestorResponse[]> {
  try {
    const response = await fetch(
      `${publicApiUrl}/contribution/investor/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const responseToJson = await response.json();
    return responseToJson.data;
  } catch (error) {
    // TODO: HANDLE ERROR
    console.log(error);
    throw error;
  }
}
