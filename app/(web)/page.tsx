"use client";

import { Card, Button } from "@heroui/react";
import { Activity, Play, CheckCircle2, XCircle, Clock, Plus, ArrowRight, Zap } from "lucide-react";

// Mock Data
const kpis = [
  { title: "Active Workflows", value: "12", trend: "+2 this week", icon: Activity, color: "text-cyan" },
  { title: "Total Executions", value: "8,245", trend: "+15% vs last month", icon: Play, color: "text-primary" },
  { title: "Success Rate", value: "99.8%", trend: "Stable", icon: CheckCircle2, color: "text-green-400" },
  { title: "Failed Runs", value: "4", trend: "-2 this week", icon: XCircle, color: "text-danger" },
];

const recentActivity = [
  { id: "1", name: "User Signup Sync", status: "success", time: "2 mins ago", duration: "1.2s" },
  { id: "2", name: "Daily Data Backup", status: "success", time: "1 hour ago", duration: "45s" },
  { id: "3", name: "Payment Processing", status: "failed", time: "3 hours ago", duration: "0.8s" },
  { id: "4", name: "Email Campaign Trigger", status: "running", time: "Just now", duration: "..." },
];

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 to-cyan/10 border border-white/10 p-8 flex items-center justify-between">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome back, Admin!</h2>
          <p className="text-foreground/70 max-w-lg">
            Your workspace is running smoothly. You have 12 active workflows processing events across 4 integrations.
          </p>
        </div>
        <div className="relative z-10 hidden sm:block">
          <Button 
            className="bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
          >
            New Workflow
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="bg-white/[0.03] border-white/5 backdrop-blur-xl shadow-lg hover:border-white/10 transition-colors">
              <Card.Content className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${kpi.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-foreground/60 text-sm font-medium mb-1">{kpi.title}</h3>
                <div className="text-3xl font-bold text-white tracking-tight mb-2">{kpi.value}</div>
                <div className="text-xs text-foreground/50">{kpi.trend}</div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Executions List */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 backdrop-blur-xl">
          <Card.Header className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Executions</h3>
            <Button variant="ghost" size="sm" className="text-cyan hover:bg-cyan/10 flex items-center gap-1">
              View All
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Card.Header>
          <Card.Content className="p-0">
            <div className="divide-y divide-white/5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 px-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-white/5">
                      {activity.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      {activity.status === "failed" && <XCircle className="h-4 w-4 text-danger" />}
                      {activity.status === "running" && <Clock className="h-4 w-4 text-cyan animate-pulse" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-cyan transition-colors">{activity.name}</h4>
                      <p className="text-xs text-foreground/50 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-mono px-2 py-1 rounded-md border ${
                      activity.status === "success" ? "bg-green-400/10 text-green-400 border-green-400/20" :
                      activity.status === "failed" ? "bg-danger/10 text-danger border-danger/20" :
                      "bg-cyan/10 text-cyan border-cyan/20"
                    }`}>
                      {activity.status.toUpperCase()}
                    </div>
                    <p className="text-xs text-foreground/40 mt-1">{activity.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Quick Actions / Status */}
        <div className="flex flex-col gap-6">
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl">
            <Card.Header className="px-6 py-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">System Status</h3>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/70">API Latency</span>
                    <span className="text-white font-mono">42ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[15%] h-full bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/70">Worker Load</span>
                    <span className="text-white font-mono">68%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[68%] h-full bg-cyan rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/70">Redis Queue</span>
                    <span className="text-white font-mono">14 items</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[5%] h-full bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Upgrade Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 backdrop-blur-xl relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
            <Card.Content className="p-6 relative z-10">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Unlock unlimited workflows, custom domains, and priority support.
              </p>
              <Button size="sm" className="w-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all">
                View Plans
              </Button>
            </Card.Content>
          </Card>
        </div>

      </div>
    </div>
  );
}
