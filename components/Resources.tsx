import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Phone, ExternalLink, BookOpen, Users, Heart, AlertCircle } from "lucide-react";

const emergencyContacts = [
  {
    name: "National Suicide Prevention Lifeline",
    number: "988",
    description: "24/7 free and confidential support",
    available: "USA",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    description: "Free 24/7 crisis support via text",
    available: "USA, UK, Canada",
  },
  {
    name: "SAMHSA National Helpline",
    number: "1-800-662-4357",
    description: "Treatment referral and information",
    available: "USA",
  },
];

const resources = [
  {
    title: "Understanding Anxiety",
    description: "Learn about anxiety disorders and coping strategies",
    icon: BookOpen,
    link: "#",
  },
  {
    title: "Depression Support",
    description: "Resources and information about depression",
    icon: Heart,
    link: "#",
  },
  {
    title: "Find a Therapist",
    description: "Connect with licensed mental health professionals",
    icon: Users,
    link: "#",
  },
  {
    title: "Support Groups",
    description: "Join communities of people with similar experiences",
    icon: Users,
    link: "#",
  },
];

const copingTechniques = [
  "Practice deep breathing exercises",
  "Engage in physical activity or stretching",
  "Connect with a trusted friend or family member",
  "Write down your thoughts and feelings",
  "Use the 5-4-3-2-1 grounding technique",
  "Listen to calming music or nature sounds",
  "Practice progressive muscle relaxation",
  "Take a break and go for a walk",
];

export function Resources() {
  return (
    <section id="resources" className="py-12">
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl" style={{ fontWeight: 600 }}>
            Mental Health Resources
          </h2>
          <p className="text-muted-foreground">
            Professional help and support are always available
          </p>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          {/* Emergency Alert */}
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <p className="mb-2" style={{ fontWeight: 600 }}>
                If you're in immediate danger or having thoughts of suicide:
              </p>
              <p>Call 911 or go to your nearest emergency room</p>
            </AlertDescription>
          </Alert>

          {/* Crisis Hotlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                24/7 Crisis Hotlines
              </CardTitle>
              <CardDescription>
                Free, confidential support available anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <h4>{contact.name}</h4>
                    <p className="text-lg text-primary" style={{ fontWeight: 600 }}>
                      {contact.number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Available: {contact.available}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mental Health Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>
                Learn more about mental health and find professional support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {resources.map((resource, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto justify-start gap-3 p-4"
                    asChild
                  >
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      <resource.icon className="h-5 w-5 shrink-0 text-primary" />
                      <div className="text-left">
                        <div className="mb-1">{resource.title}</div>
                        <div className="text-xs text-muted-foreground" style={{ fontWeight: 400 }}>
                          {resource.description}
                        </div>
                      </div>
                      <ExternalLink className="ml-auto h-4 w-4 shrink-0" />
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coping Techniques */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Coping Techniques</CardTitle>
              <CardDescription>
                Simple strategies to help when you're feeling overwhelmed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {copingTechniques.map((technique, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-lg bg-muted/50 p-3"
                  >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <p className="text-sm">{technique}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="rounded-lg bg-muted/50 p-6 text-center text-sm text-muted-foreground">
            <p>
              💙 This platform is designed for support and self-care, not for diagnosis or treatment.
              Always consult with qualified mental health professionals for personalized care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
