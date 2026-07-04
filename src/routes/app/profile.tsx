import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../dashboard/profile/index";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});
