import { useSelector } from "react-redux";

export default function useOnlineStatus() {
  return useSelector((state) => state.pwa.online);
}
