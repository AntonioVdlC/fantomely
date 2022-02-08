import { Form } from "remix";
import Button from "~/components/Button";
import Input from "~/components/Input";
import LayoutGrid from "~/components/LayoutGrid";

export default function WebsiteCreateForm() {
  return (
    <Form
      method="post"
      action="/app/websites/create"
      className="mt-3 space-y-4"
    >
      <LayoutGrid>
        <Input
          type="text"
          id="name"
          name="name"
          label="Name"
          placeholder="Fantomely"
        />
        <Input
          type="text"
          id="url"
          name="url"
          label="Link"
          placeholder="https://fantomely.com"
          required
        />
      </LayoutGrid>
      <LayoutGrid>
        <Button primary type="submit">
          Add website
        </Button>
      </LayoutGrid>
    </Form>
  );
}
