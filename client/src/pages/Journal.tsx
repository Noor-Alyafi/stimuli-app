import { useState } from "react";
import { useStaticJournal } from "@/hooks/useStaticData";
import { useStaticAuth } from "@/hooks/useStaticAuth";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";


export default function Journal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [focusLevel, setFocusLevel] = useState([7]);
  const [energyLevel, setEnergyLevel] = useState("medium");
  const [reflection, setReflection] = useState("");

  const { data: journalEntries } = useQuery({
    queryKey: ["/api/journal"],
    retry: false,
  });

  const submitJournalMutation = useMutation({
    mutationFn: async (entryData: any) => {
      await apiRequest("POST", "/api/journal", entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setReflection("");
      setFocusLevel([7]);
      setEnergyLevel("medium");
      toast({
        title: "Journal entry saved!",
        description: "Thanks for checking in. +5 XP earned!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitJournalMutation.mutate({
      focusLevel: focusLevel[0],
      energyLevel,
      reflection,
    });
  };

  const energyLevels = [
    { value: "low", label: "Low", icon: "🔋" },
    { value: "medium", label: "Medium", icon: "🔋" },
    { value: "high", label: "High", icon: "🔋" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-inter font-bold text-navy mb-2">
          Mind Journal
        </h2>
        <p className="text-gray-600">
          Track your thoughts and cognitive wellness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="font-inter font-semibold text-navy mb-6">
                Daily Check-in
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Focus Level Slider */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    How focused do you feel today?
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={focusLevel}
                      onValueChange={setFocusLevel}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Scattered</span>
                      <span className="font-medium text-navy">{focusLevel[0]}/10</span>
                      <span>Laser-focused</span>
                    </div>
                  </div>
                </div>

                {/* Energy Level */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Energy Level
                  </Label>
                  <div className="flex space-x-2">
                    {energyLevels.map((level) => (
                      <Button
                        key={level.value}
                        type="button"
                        variant={energyLevel === level.value ? "default" : "outline"}
                        onClick={() => setEnergyLevel(level.value)}
                        className={`px-4 py-2 ${
                          energyLevel === level.value
                            ? "bg-cyan text-white border-cyan"
                            : "border-gray-200 text-gray-600 hover:border-cyan hover:text-cyan"
                        }`}
                      >
                        <span className="mr-2">{level.icon}</span>
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reflection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    What did today's training make you feel?
                  </Label>
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Describe your experience, insights, or any challenges you faced..."
                    className="resize-none"
                    rows={4}
                  />
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-navy hover:bg-navy/90"
                  disabled={submitJournalMutation.isPending}
                >
                  {submitJournalMutation.isPending ? "Saving..." : "Save Entry (+5 XP)"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journal History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-8">
              <h3 className="font-inter font-semibold text-navy mb-6">
                Recent Entries
              </h3>
              
              <div className="space-y-4">
                {journalEntries?.length ? (
                  journalEntries.map((entry: any) => (
                    <div key={entry.id} className="border-l-4 border-cyan pl-4 py-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Focus: {entry.focusLevel}/10
                        </span>
                      </div>
                      {entry.reflection && (
                        <p className="text-gray-600 text-sm">{entry.reflection}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No journal entries yet.</p>
                    <p className="text-sm mt-2">Start by filling out your first check-in!</p>
                  </div>
                )}
              </div>

              {/* Mood Trends Placeholder */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-navy mb-4">Weekly Focus Trends</h4>
                <div className="h-24 bg-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    {journalEntries?.length ? 
                      "Your focus levels are looking good! Keep it up! 📈" : 
                      "Complete a few entries to see your trends"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
