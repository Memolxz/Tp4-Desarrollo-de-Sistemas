import React, { useState, type JSX } from 'react';
import { ChevronLeft, ChevronRight, FileText, Calendar, Tag, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BasePage from './BasePage';
import { eventService } from '../services/event-service';

const EventCreator: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [shortDescription, setShortDescription] = useState<string>('');
  const [detailedDescription, setDetailedDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const categories: { key: string; label: string }[] = [
    { key: 'FESTIVAL', label: 'Festival' },
    { key: 'RECITAL', label: 'Recital' },
    { key: 'REUNION_TEMATICA', label: 'Reunión Temática' },
    { key: 'ENCUENTRO_BARRIAL', label: 'Encuentro Barrial' },
    { key: 'CUMPLEANIOS', label: 'Cumpleaños' },
    { key: 'CASAMIENTO', label: 'Casamiento' },
    { key: 'OTRO', label: 'Otro' }
  ];

  const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays: string[] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  const previousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selectDate = (day: number): void => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const formatDate = (date: Date): string => {
    const days: string[] = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()].toLowerCase();
    const year = date.getFullYear();
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede superar los 5MB');
        return;
      }
     
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setImage(null);
    setImageFile(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const renderCalendar = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2 text-gray-100"></div>);
    }
    
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = selectedDate?.getDate() === day && 
                        selectedDate?.getMonth() === currentMonth.getMonth() &&
                        selectedDate?.getFullYear() === currentMonth.getFullYear();
      const isToday = day === 27 && currentMonth.getMonth() === 9;
      
      days.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          className={`text-center py-2 cursor-pointer rounded-full transition-colors ${
            isSelected 
              ? 'bg-accent text-white' 
              : isToday
              ? 'bg-gray-100 text-gray-700'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const handleSubmit = async (): Promise<void> => {
    setError('');

    // Validaciones
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!location.trim()) {
      setError('La ubicación es requerida');
      return;
    }
    if (!shortDescription.trim()) {
      setError('La descripción corta es requerida');
      return;
    }
    if (!detailedDescription.trim()) {
      setError('La descripción detallada es requerida');
      return;
    }
    if (!category) {
      setError('Selecciona una categoría');
      return;
    }
    if (!selectedDate) {
      setError('Selecciona una fecha');
      return;
    }
    if (!startTime) {
      setError('Selecciona una hora de inicio');
      return;
    }
    if (isPaid && (!price || parseFloat(price) <= 0)) {
      setError('El precio debe ser mayor a 0 para eventos pagos');
      return;
    }

    // Combinar fecha y hora
    const [hours, minutes] = startTime.split(':');
    const eventDateTime = new Date(selectedDate);
    eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Validar que la fecha no sea en el pasado
    if (eventDateTime <= new Date()) {
      setError('La fecha y hora del evento deben ser en el futuro');
      return;
    }

    try {
      setLoading(true);
     
      const eventData = {
        title,
        location,
        shortDescription,
        fullDescription: detailedDescription,
        category,
        date: eventDateTime.toISOString(),
        isPaid,
        price: isPaid ? parseFloat(price) : undefined,
      };

      const createdEvent = await eventService.createEvent(eventData, imageFile || undefined);
     
      alert('¡Evento creado exitosamente!');
      navigate(`/event/${createdEvent.id}`);
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};;
      setError(error.response?.data?.error || 'Error al crear el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage pageName="Create Event">
    <div className="min-h-screen bg-dominant p-8 font-geist">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-2">Crear Nuevo Evento</h1>
        <p className="text-accent/80 mb-8">Completa los detalles de tu evento y selecciona la fecha</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Event Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-accent gap-2 mb-6">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-bold">Información del Evento</h2>
            </div>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-md text-accent font-bold mb-2">Título del Evento</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Conferencia de Tecnología 2025"
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-md text-accent font-bold mb-2">Ubicación *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Buenos Aires, Argentina"
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              {/* Short Description */}
              <div>
                <label className="block text-md text-accent font-bold mb-2">Descripción Corta</label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value.slice(0, 150))}
                  placeholder="Una breve descripción del evento (máx. 150 caracteres)"
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows={3}
                />
                <p className="text-sm text-accent mt-1">{shortDescription.length}/150 caracteres</p>
              </div>
              
              {/* Detailed Description */}
              <div>
                <label className="block text-md text-accent font-bold mb-2">Descripción Detallada</label>
                <textarea
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Describe tu evento en detalle. Incluye información sobre actividades, ponentes, agenda, etc."
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows={5}
                />
              </div>
              
              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-accent">
                  <Tag className="w-4 h-4" />
                  <label className="block text-md font-bold">Categoría del Evento</label>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                        {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Evento */}
              <div>
                <label className="block text-md text-accent font-bold mb-2">Tipo de Evento *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPaid}
                      onChange={() => {
                        setIsPaid(false);
                        setPrice('');
                      }}
                      className="w-5 h-5 accent-accent"
                    />
                    <span className="text-accent">Gratuito</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="w-5 h-5 accent-accent"
                    />
                    <span className="text-accent">De Pago</span>
                  </label>
                </div>
              </div>

              {/* Precio (si es pago) */}
              {isPaid && (
                <div>
                  <label className="block text-md text-accent font-bold mb-2">Precio (ARS) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-2 text-accent">Imagen del Evento</label>
                {!image ? (
                  <div className="border-2 border-dashed border-accent rounded-lg p-8 text-center hover:border-hovercolor transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-accent mb-2" />
                      <span className="text-sm text-accent mb-1">
                        Haz clic para subir una imagen
                      </span>
                      <span className="text-xs text-accent/80">
                        PNG, JPG o JPEG (máx. 5MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-accent text-white p-2 rounded-full hover:bg-hovercolor transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Date Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6 text-accent">
              <Calendar className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Fecha del Evento</h2>
            </div>
            
            {/* Calendar */}
            <div className="mb-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4 text-accent">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-hovercolor rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-semibold text-lg">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-hovercolor rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-7 bg-accent rounded-full gap-2 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-white">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
            </div>
            
            {/* Selected Date Display */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-accent mb-1">Fecha seleccionada:</p>
              <p className="text-lg font-bold text-accent">
                {selectedDate ? formatDate(selectedDate) : 'No se ha seleccionado ninguna fecha'}
              </p>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-accent">Horario del Evento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-semibold mb-2 text-accent">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Create Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-accent hover:bg-hovercolor text-xl text-white font-bold py-4 rounded-lg transition-colors"
          >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando Evento...
                </div>
              ) : (
                'Crear Evento'
              )}
          </button>
        </div>
      </div>
    </div>
    </BasePage>
  );
};

export default EventCreator;