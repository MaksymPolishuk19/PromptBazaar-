import WalletContextProvider from "@/components/SolanaProvirer/SolanaProvirer";
import "./globals.css";
import Header from "@/components/Header/Header";
import Container from "@/components/Container/Container";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          <Container>
            <Header />
            {children}
          </Container>
        </WalletContextProvider>
      </body>
    </html>
  );
}
