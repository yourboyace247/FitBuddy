import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen}) {
  const menuItems = [
    { label: 'Add a workout plan', path: '/add-workout' },
    { label: 'Add your daily meals', path: '/add-meals' },
    { label: 'My workout plans', path: '/workout-plans' },
    { label: 'My daily meals', path: '/daily-meals' },
  ];

return (
    <aside className={`
      ${isOpen ? 'fixed md:relative w-64 z-40 h-full' : 'w-0 md:w-16'}
  transition-all duration-300
    `}>
      <div className={`p-4 ${!isOpen ? 'opacity-0 md:opacity-100' : ''}`}>
        {/* Header - κρύβεται όταν κλειστό */}
        {isOpen && (
          <h3 className="font-bold text-gray-700 mb-4">Menu</h3>
        )}
        
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link 
                to={item.path}
                className={`
                  flex items-center p-2 hover:bg-gray-100 rounded transition-colors
                  ${isOpen ? '' : 'justify-center'}
                `}
                title={!isOpen ? item.label : ''}
              >
                {isOpen ? (
                  <span>{item.label}</span>
                ) : (
                  <span className="text-lg" title={item.label}>
                    {getIconForMenuItem(item.label)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function getIconForMenuItem(label) {
  const icons = {
    'Add a workout plan': '🏋️',
    'Add your daily meals': '🍎',
    'My workout plans': '📋',
    'My daily meals': '📊',
  };
  return icons[label] || '•';
}