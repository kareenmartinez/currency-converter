import { createBrowserRouter } from "react-router-dom";

import { ConverterPage } from "@/pages/ConverterPage";
import { AppLayout } from "@/components/AppLayout";
import { PageError } from "@/components/errors/PageError";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: (
      <PageError
        title="Unable to load page"
        message="We couldn't load this page. Please refresh the page."
      />
    ),
    children: [
      {
        path: "/",
        element: <ConverterPage />,
      },
    ],
  },
]);
