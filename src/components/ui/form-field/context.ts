import { createContext, useContext } from "react";

export type FormFieldContextValue = {
	messageId: string;
	hasMessage: boolean;
	invalid: boolean;
};

export const FormFieldContext = createContext<FormFieldContextValue | null>(
	null,
);

export function useFormFieldContext() {
	return useContext(FormFieldContext);
}
