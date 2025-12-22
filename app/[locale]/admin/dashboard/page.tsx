"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/hooks/useSession";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalUsers: number;
  availableSpaces: number;
  revenue: number;
}

interface Booking {
  id: string;
  user_email: string;
  user_name: string;
  spaceType: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
}

interface Subscription {
  id: string;
  user_email: string;
  user_name: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
}

interface Space {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  available: boolean;
  description: string;
}

interface Schedule {
  id: string;
  spaceId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
type TabId = 'dashboard' | 'bookings' | 'subscriptions' | 'spaces' | 'schedule' | 'settings';
const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'bookings', label: 'Reservas' },
  { id: 'subscriptions', label: 'Suscripciones' },
  { id: 'spaces', label: 'Espacios' },
  { id: 'schedule', label: 'Horarios' },
  { id: 'settings', label: 'Configuración' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
      return;
    }
    
    if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push(`/${locale}`);
      return;
    }

    if (status === 'authenticated' && session?.user.role === 'admin') {
      loadData();
    }
  }, [status, session, router, locale]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Load bookings
      const bookingsRes = await fetch('/api/admin/bookings');
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      // Load subscriptions
      const subscriptionsRes = await fetch('/api/admin/subscriptions');
      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData.subscriptions || []);
      }

      // Load spaces
      const spacesRes = await fetch('/api/admin/spaces');
      if (spacesRes.ok) {
        const spacesData = await spacesRes.json();
        setSpaces(spacesData.spaces || []);
      }

      // Load schedule
      const scheduleRes = await fetch('/api/admin/schedule');
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setSchedules(scheduleData.schedules || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta suscripción?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/subscriptions?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSubscriptions(subscriptions.filter(s => s.id !== id));
        alert('Suscripción eliminada exitosamente');
        loadData();
      } else {
        alert('Error al eliminar la suscripción');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Error al eliminar la suscripción');
    }
  };

  const handleToggleSpace = async (id: string, available: boolean) => {
    try {
      const res = await fetch('/api/admin/spaces', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, available: !available }),
      });

      if (res.ok) {
        setSpaces(spaces.map(s => s.id === id ? { ...s, available: !available } : s));
        loadData();
      }
    } catch (error) {
      console.error('Error updating space:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Bienvenido, {session?.user.name || session?.user.email}</span>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' });
                  router.push(`/${locale}`);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Reservas</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-gray-500 mt-2">
                {stats.pendingBookings} pendientes, {stats.confirmedBookings} confirmadas
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Suscripciones</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSubscriptions}</p>
              <p className="text-sm text-gray-500 mt-2">{stats.activeSubscriptions} activas</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Espacios Disponibles</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.availableSpaces}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Ingresos Totales</h3>
              <p className="text-3xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Reservas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Espacio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.user_name || booking.user_email}</div>
                        <div className="text-sm text-gray-500">{booking.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.spaceType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.startTime} {booking.endTime ? `- ${booking.endTime}` : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${booking.amount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Suscripciones</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Fin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sub.user_name || sub.user_email}</div>
                        <div className="text-sm text-gray-500">{sub.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{sub.plan}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          sub.status === 'active' ? 'bg-green-100 text-green-800' :
                          sub.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(sub.startDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sub.endDate ? new Date(sub.endDate).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sub.amount?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Spaces Tab */}
        {activeTab === 'spaces' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Espacios</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spaces.map((space) => (
                  <div key={space.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        space.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {space.available ? 'Disponible' : 'Ocupado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Tipo: {space.type}</p>
                    <p className="text-sm text-gray-600 mb-2">Capacidad: {space.capacity} personas</p>
                    <p className="text-sm text-gray-600 mb-2">Precio: ${space.price?.toFixed(2) || '0.00'}</p>
                    {space.description && (
                      <p className="text-sm text-gray-500 mb-4">{space.description}</p>
                    )}
                    <button
                      onClick={() => handleToggleSpace(space.id, space.available)}
                      className={`w-full px-4 py-2 rounded-lg font-medium ${
                        space.available
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {space.available ? 'Marcar como Ocupado' : 'Marcar como Disponible'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Horarios</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{daysOfWeek[schedule.dayOfWeek]}</h3>
                        <p className="text-sm text-gray-600">
                          {schedule.openTime} - {schedule.closeTime}
                        </p>
                        {schedule.spaceId && (
                          <p className="text-xs text-gray-500">Espacio: {schedule.spaceId}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        schedule.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {schedule.isOpen ? 'Abierto' : 'Cerrado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Aquí puedes configurar las opciones generales del sistema.</p>
            {/* Add more settings here */}
          </div>
        )}
      </div>
    </div>
  );
}

