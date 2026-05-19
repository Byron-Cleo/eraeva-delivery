import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { APP_NAME } from "@/lib/constants";

interface VerificationEmailProps {
  name: string;
  email: string;
  token: string;
}

const VerificationEmail = ({ name, email, token }: VerificationEmailProps) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for {APP_NAME}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[600px] p-6">
            <Heading className="text-center text-2xl font-bold text-gray-900">
              Verify your email address
            </Heading>
            <Text className="text-gray-700">
              Hi {name},
            </Text>
            <Text className="text-gray-700">
              Thank you for creating an account with {APP_NAME}. Please verify
              your email address by clicking the link below:
            </Text>
            <Section className="text-center my-8">
              <Link
                href={verifyUrl}
                className="inline-block rounded-md bg-gray-900 px-6 py-3 text-white no-underline"
              >
                Verify Email Address
              </Link>
            </Section>
            <Text className="text-gray-700">
              Or copy and paste this URL into your browser:
            </Text>
            <Text className="break-all text-sm text-gray-500">
              {verifyUrl}
            </Text>
            <Text className="text-gray-700">
              This link will expire in 24 hours.
            </Text>
            <Text className="text-gray-700">
              If you did not create an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
