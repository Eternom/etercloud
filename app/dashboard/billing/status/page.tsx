import Link from "next/link"
import { CheckCircle2, XCircle, ArrowRight, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import stripe from "@/lib/stripe"

interface StatusPageProps {
  searchParams: Promise<{ session_id?: string; canceled?: string }>
}

export default async function BillingStatusPage({ searchParams }: StatusPageProps) {
  const { session_id, canceled } = await searchParams

  if (canceled) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Payment canceled</CardTitle>
            <CardDescription>
              Your transaction was canceled. No charge has been made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              If you ran into an issue during checkout, feel free to contact us or try again.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/pricing">Back to plans</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/dashboard/billing">My billing</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const customerEmail = session.customer_details?.email

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Subscription activated!</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your subscription is now active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to{" "}
                <span className="font-medium text-foreground">{customerEmail}</span>.
              </p>
              <div className="rounded-lg bg-muted p-4 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Transaction details</span>
                </div>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>Session ID: {session_id.slice(0, 20)}...</p>
                  <p>Payment status: <span className="text-primary font-medium">Successful</span></p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/servers">Go to my servers <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/dashboard/billing">Manage my subscription</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    } catch (error) {
      console.error("Error retrieving Stripe session:", error)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We could not retrieve your transaction details.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard/billing">Back to billing</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
