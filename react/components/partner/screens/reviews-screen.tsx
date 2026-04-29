"use client";

import { Star } from "lucide-react";
import { 
  reviews, 
  currentPartner,
  properties,
  getCustomerById, 
  getPropertyById,
  formatDate 
} from "@/data/mock-data";
import { SectionHeader } from "@/components/shared/section-header";
import { ReviewCard } from "@/components/shared/review-card";

export function PartnerReviewsScreen() {
  const partnerProperties = properties.filter(p => p.partnerId === currentPartner.id);
  const partnerReviews = reviews.filter(r => 
    partnerProperties.some(p => p.id === r.propertyId)
  );

  const averageRating = partnerReviews.length > 0
    ? (partnerReviews.reduce((sum, r) => sum + r.rating, 0) / partnerReviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: partnerReviews.filter(r => r.rating === rating).length,
    percentage: partnerReviews.length > 0 
      ? Math.round((partnerReviews.filter(r => r.rating === rating).length / partnerReviews.length) * 100)
      : 0
  }));

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Reviews" 
        description="See what guests are saying about your properties"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
            <span className="text-4xl font-bold">{averageRating}</span>
          </div>
          <p className="text-muted-foreground mt-2">Average Rating</p>
          <p className="text-sm text-muted-foreground">{partnerReviews.length} total reviews</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="font-medium mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {partnerReviews.map((review) => {
          const customer = getCustomerById(review.customerId);
          const property = getPropertyById(review.propertyId);

          return (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{property?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </div>
              <ReviewCard 
                author={customer?.name || 'Anonymous'}
                rating={review.rating}
                comment={review.comment}
                date={formatDate(review.createdAt)}
              />
            </div>
          );
        })}

        {partnerReviews.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Star className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-medium mt-4">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reviews will appear here once guests complete their stays.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
