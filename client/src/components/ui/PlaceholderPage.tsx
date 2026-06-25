import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <Typography variant="headline">{title}</Typography>
      <Typography variant="body">{description}</Typography>
      <Card className="border-dashed border-white/20 mt-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Typography variant="caption" className="text-text-tertiary">
            Coming Soon
          </Typography>
        </div>
      </Card>
    </div>
  );
}
