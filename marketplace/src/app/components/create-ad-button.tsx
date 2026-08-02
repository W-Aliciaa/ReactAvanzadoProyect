import { useFormStatus } from "react-dom";

export function CreateAdButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creando" : "Crear"}
    </button>
  );
}
