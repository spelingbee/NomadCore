"use client";

import { Lightbulb, TrendingUp, AlertCircle, Target, Calendar, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { InsightCard } from "@/components/shared/insight-card";

type Insight = {
  id: string;
  title: string;
  insight: string;
  type: 'info' | 'success' | 'warning';
  category: string;
  impact: 'high' | 'medium' | 'low';
};

const insights: Insight[] = [
  {
    id: '1',
    title: 'Song-Kul Weekend Demand',
    insight: 'Song-Kul occupancy is projected to reach 95% for July weekends. Current yurt capacity may be insufficient. Consider fast-tracking new partner verifications in the area.',
    type: 'warning',
    category: 'Capacity',
    impact: 'high',
  },
  {
    id: '2',
    title: 'Ala-Archa Vehicle Entry Peaks',
    insight: 'Ala-Archa vehicle entry demand peaks on Saturdays at 150% of weekday average. Recommend implementing advance booking system or dynamic pricing for park entry.',
    type: 'info',
    category: 'Infrastructure',
    impact: 'high',
  },
  {
    id: '3',
    title: 'Rest Point Service Bundling',
    insight: 'Rest point shower service has 35% higher attach rate when bundled with packages. Recommend partner incentives for service bundling.',
    type: 'success',
    category: 'Revenue',
    impact: 'medium',
  },
  {
    id: '4',
    title: 'Sary-Chelek Underperformance',
    insight: 'Sary-Chelek has 38% lower bookings than capacity suggests. Marketing campaign targeting eco-tourism and nature photography segments recommended.',
    type: 'info',
    category: 'Marketing',
    impact: 'medium',
  },
  {
    id: '5',
    title: 'International Booking Growth',
    insight: 'International bookings up 45% YoY, primarily from Germany, Japan, and France. Consider multi-language support and international payment options.',
    type: 'success',
    category: 'Growth',
    impact: 'high',
  },
  {
    id: '6',
    title: 'Partner Verification Backlog',
    insight: '3 partner applications pending verification for 2+ weeks. Faster verification correlates with 28% higher partner activation rates.',
    type: 'warning',
    category: 'Operations',
    impact: 'medium',
  },
];

const impactColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
};

export function AdminInsightsScreen() {
  const highImpact = insights.filter(i => i.impact === 'high');
  const otherInsights = insights.filter(i => i.impact !== 'high');

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="AI Insights" 
        description="Data-driven recommendations for tourism optimization"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{highImpact.length}</p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{insights.filter(i => i.type === 'success').length}</p>
            <p className="text-sm text-muted-foreground">Opportunities</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{insights.length}</p>
            <p className="text-sm text-muted-foreground">Total Insights</p>
          </div>
        </div>
      </div>

      {/* High Priority */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          High Priority Actions
        </h2>
        <div className="space-y-4">
          {highImpact.map((insight) => (
            <div key={insight.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[insight.impact]}`}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted">
                      {insight.category}
                    </span>
                  </div>
                  <InsightCard 
                    title={insight.title}
                    insight={insight.insight}
                    type={insight.type}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Other Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {otherInsights.map((insight) => (
            <div key={insight.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[insight.impact]}`}>
                  {insight.impact.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted">
                  {insight.category}
                </span>
              </div>
              <InsightCard 
                title={insight.title}
                insight={insight.insight}
                type={insight.type}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Strategic Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium">Short-term (1-3 months)</h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>- Implement Ala-Archa advance booking system</li>
                  <li>- Fast-track Song-Kul partner verifications</li>
                  <li>- Launch rest point service bundling program</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-medium">Long-term (6-12 months)</h3>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>- Develop Sary-Chelek eco-tourism packages</li>
                  <li>- Multi-language platform support</li>
                  <li>- International payment integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
