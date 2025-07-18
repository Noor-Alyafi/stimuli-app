import { useQuery } from "@tanstack/react-query";
import { ProgressChart } from "@/components/ProgressChart";
import { GrowthTree } from "@/components/GrowthTree";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ProgressPage() {
  const { user } = useAuth();
  
  const { data: gameProgress } = useQuery({
    queryKey: ["/api/game-progress"],
    retry: false,
  });

  const { data: skillProgress } = useQuery({
    queryKey: ["/api/skill-progress"],
    retry: false,
  });

  if (!user) return null;

  // Transform game progress data for chart
  const chartData = gameProgress?.slice(0, 10).reverse().map((progress: any, index: number) => ({
    date: new Date(progress.completedAt).toLocaleDateString(),
    score: progress.score,
  })) || [];

  // Default skill levels if no data
  const defaultSkills = [
    { skillType: "memory", level: 75 },
    { skillType: "attention", level: 82 },
    { skillType: "speed", level: 68 },
    { skillType: "pattern", level: 90 },
  ];

  const skills = skillProgress?.length ? skillProgress : defaultSkills;

  const skillNames = {
    memory: "Memory",
    attention: "Attention", 
    speed: "Processing Speed",
    pattern: "Pattern Recognition",
  };

  const skillColors = {
    memory: "bg-blue-500",
    attention: "bg-green-500",
    speed: "bg-yellow-500", 
    pattern: "bg-purple-500",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-inter font-bold text-navy mb-2">
          Your Progress
        </h2>
        <p className="text-gray-600">
          Track your cognitive development over time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <ProgressChart data={chartData} />
        </motion.div>

        {/* Tree Growth & Stats */}
        <div className="space-y-6">
          {/* Tree Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-inter font-semibold text-navy mb-4">
                  Growth Tree
                </h3>
                
                <GrowthTree 
                  xp={user.xp || 0}
                  level={user.level || 1}
                  achievements={3}
                  className="w-full"
                />
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total XP</span>
                    <span className="font-medium text-navy">{user.xp || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium text-navy">Neural Explorer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Active</span>
                    <span className="font-medium text-navy">{user.streak || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skill Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="font-inter font-semibold text-navy mb-4">
                  Skill Breakdown
                </h3>
                
                <div className="space-y-4">
                  {skills.map((skill: any) => (
                    <div key={skill.skillType}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {skillNames[skill.skillType as keyof typeof skillNames]}
                        </span>
                        <span className="font-medium text-navy">
                          {Math.round(skill.level)}%
                        </span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
