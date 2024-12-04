import Navbar from "./navbar";
import { getSessionByUserEmail } from "../../services/session";

export default async function Nav() {
  const session = await getSessionByUserEmail();
  return <Navbar session={session} />;
}
