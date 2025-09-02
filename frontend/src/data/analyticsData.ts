export interface AnalyticsData {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const analyticsData: AnalyticsData[] = [
  {
    id: '1',
    title: 'All Time Income',
    value: '115K',
    change: '+3.67%',
    changeType: 'positive'
  },
  {
    id: '2',
    title: 'All Time Profit',
    value: '3.73K',
    change: '+3.67%',
    changeType: 'positive'
  },
  {
    id: '3',
    title: 'All Time Expense',
    value: '$29.5K',
    change: '-6%',
    changeType: 'negative'
  },
  {
    id: '4',
    title: 'All Time Profit Rate',
    value: '16.66%',
    changeType: 'neutral'
  },
  {
    id: '5',
    title: 'Subscription Revenue',
    value: '$30.67K',
    change: '+3.67%',
    changeType: 'positive'
  },
  {
    id: '6',
    title: 'Consultancy Revenue',
    value: '3.73K',
    change: '+3.67%',
    changeType: 'positive'
  },
  {
    id: '7',
    title: 'Total Coach',
    value: '1002'
  },
  {
    id: '8',
    title: 'Total Student',
    value: '5500',
    change: '-12%',
    changeType: 'negative'
  }
];
