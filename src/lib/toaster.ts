import { createToaster } from "@ark-ui/react/toast";

export const toaster = createToaster({
	placement: "top-end",
	duration: 5000,
	max: 3,
	overlap: false,
});
