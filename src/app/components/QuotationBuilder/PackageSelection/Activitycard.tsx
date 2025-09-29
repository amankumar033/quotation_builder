import { Activity } from "@/types/type"; // Import the Activity type

interface ActivityCardProps {
  activity: Activity; // Use the imported Activity type
  isSelected: boolean;
  onSelect: (activityId: string) => void; // Change to string
  theme: any;
}

export default function ActivityCard({ activity, isSelected, onSelect, theme }: ActivityCardProps) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
      isSelected ? 'ring-2 ring-purple-500 border-purple-500' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img 
          src={activity.image} 
          alt={activity.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-activity.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{activity.name}</h3>
          <span className="font-bold text-gray-900">₹{activity.price}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Duration: {activity.duration}</span>
          {activity.category && <span>{activity.category}</span>}
        </div>

        <button
          onClick={() => onSelect(activity.id)}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            isSelected
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-purple-400 text-white hover:bg-gray-200'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Activity'}
        </button>
      </div>
    </div>
  );
}