import { Profile, type ProfileRequest } from "@/lib/definitions";
import { formatDateString } from "@/lib/utils";
import { publicApiUrl } from "../../services/config";

export async function fetchVerifySignContract(
  userId: number,
): Promise<Partial<Profile> | null> {
  try {
    const response = await fetch(
      `${publicApiUrl}/profile/verifySignedContract/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`, TODO:
        },
      },
    );
    console.log("response", response);
    const resToJson = await response.json();
    console.log("resToJson", resToJson);

    if (!response.ok) {
      throw new Error(
        `${response.statusText}. ${resToJson.message} ` || "Failed to register",
      );
    }
    // const { data } = await response.json();
    return resToJson.data;
  } catch (error) {
    console.error("Error fetching verify sign contract:", error);
    throw error;
  }
}

// REQUEST TO API FROM NEXTJS
export async function fetchUpsert(
  payload: ProfileRequest,
): Promise<Profile | undefined> {
  try {
    console.log("PAYLOAD", payload);
    // SCOPE: convert
    const birthdateFormatted = formatDateString(
      payload.birthdate,
    ).toISOString();

    console.log("dateFormated", birthdateFormatted);

    const formData = new FormData();
    formData.append("gender", payload.gender);
    formData.append("birthdate", birthdateFormatted);
    formData.append("address", payload.address);
    formData.append("frontIdDocumentFile", payload.frontIdDocumentFile);
    formData.append("reverseIdDocumentFile", payload.reverseIdDocumentFile);
    formData.append("userId", payload.userId.toString());

    const response = await fetch(`/api/profile/upsert`, {
      method: "POST",
      body: formData,
    });

    console.log("response", response);
    const resToJson = await response.json();
    console.log("resToJson", resToJson);

    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.statusText}. ${resToJson.message} `,
      );
    }
    return resToJson.data; // expect { data: Profile }
  } catch (error) {
    throw error;
  }
}
