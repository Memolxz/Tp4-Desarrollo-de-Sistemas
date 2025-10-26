import { Star, SquareArrowOutUpRight, ChevronLeft, MessageCircle, UserRound, StarHalf, Trash2, FlaskConical, Plus  } from "lucide-react"
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import img1 from '../assets/fondo.png'


type Ingredient = {
  id: number;
  name: string;
};


type ProductIngredient = {
  ingredient: Ingredient;
};


type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  rating: number | null;
  officialUrl: string;
  imageUrl: string | null;
  price: string | null;
  category: string;
  bodyPart: string;
  productIngredients: ProductIngredient[];
};


type Comment = {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};


const categoryDisplayNames: Record<string, string> = {
    SERUM: "Sérum",
    CLEANSER: "Limpiador",
    TONER: "Tonificador",
    SUNSCREEN: "Protector Solar",
    MASK: "Mascarilla",
    MOISTURIZER: "Hidratante",
    EXFOLIANT: "Exfoliante",
    TREATMENT: "Tratamiento",
    EYE_CREAM: "Crema de Ojos",
    FACIAL_OIL: "Aceite Facial",
    MIST: "Mist",
    ESSENCE: "Esencia",
};

const bodyPartDisplayNames: Record<string, string> = {
    FACE: "Rostro",
    EYES: "Ojos",
    BODY: "Cuerpo",
    GENERAL: "General",
};


export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: number; isAdmin: boolean } | null>(null);
 
  // Comment form
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchComments();
      getUserFromToken();
    }
  }, [id]);


  const getUserFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;


    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, isAdmin: payload.isAdmin || false });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };


  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/products/${id}`);
    
      if (!response.ok) {
        throw new Error("Producto no encontrado");
      }


      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/products/${id}/comments`);
     
      if (response.ok) {
        const data = await response.json();
        setComments(data.ok ? data.data : []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };


  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/register");
      return;
    }


    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/products/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          rating: newRating,
        }),
      });


      if (response.ok) {
        setNewComment("");
        setNewRating(5);
        setShowCommentForm(false);
        fetchComments();
        fetchProduct();
      } else {
        const data = await response.json();
        alert(data.error || "Error al agregar comentario");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Error al agregar comentario");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;


    if (!confirm("¿Estás seguro de eliminar este comentario?")) return;


    try {
      const response = await fetch(`http://localhost:8000/products/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });


      if (response.ok) {
        fetchComments();
        fetchProduct();
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };


  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;


    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 text-darkblue fill-current" />);
    }


    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative h-5 w-5">
          <Star className="absolute h-5 w-5 text-darkblue" />
          <StarHalf className="absolute h-5 w-5 text-darkblue fill-current" />
        </div>
      );
    }


    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-darkblue" />);
    }


    return stars;
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl font-semibold text-darkblue mb-4">
            Cargando producto...
          </div>
          <div className="w-8 h-8 border-4 border-darkblue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }


  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">{error || "Producto no encontrado"}</div>
          <Link
            to="/products"
            className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-hovertext transition"
          >
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }


  return(
    <div className="flex flex-col justify-center font-geist items-center bg-background w-full">
      <Header />
      <div className="w-[90%] pt-10 pb-10">
          <div className="w-full h-24 overflow-hidden rounded-3xl relative">
              <img
                  src={img1}
                  alt="Agua Header"
                  className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
          </div>
      </div>


      {/* Product Details Section */}
      <div className="relative flex flex-row justify-between items-between bg-rectangles w-[90%] rounded-3xl h-full mb-10 border border-rectangles">
        {/* Imagen */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-3xl p-10 relative">
          <Link to="/products">
            <ChevronLeft className="absolute top-5 left-5 text-darkblue h-10 w-10 z-10" />
          </Link>
          <div className="absolute top-5 left-20 bg-darkblue/60 text-white font-semibold px-3 h-8 flex items-center rounded-2xl">
            <p>{bodyPartDisplayNames[product.bodyPart] || product.bodyPart}</p>
          </div>
          <div className="absolute top-5 right-5 bg-darkblue/60 text-white font-semibold px-3 h-8 flex items-center rounded-2xl">
            <p>{categoryDisplayNames[product.category] || product.category}</p>
          </div>


          <div className="flex justify-center items-center h-[400px] w-full">
            <img
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-2xl"
              onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
            />
          </div>
        </div>


        <div className="flex flex-col items-start bg-transparent w-1/2 p-10">
          <h1 className="text-start font-bold text-darkblue text-3xl">{product.name}</h1>
          <p className="text-start text-darkblue font-normal text-md mr-10 mt-5 mb-5">{product.description}</p>
          <p className="text-start text-darkblue font-normal text-md mt-5"><strong>Marca: </strong>{product.brand}</p>
          {product.rating && (
            <div className="flex flex-row justify-start items-center bg-transparent w-full my-5">
              {renderStars(product.rating)}
              <span className="ml-2 text-darkblue font-semibold">({product.rating.toFixed(1)})</span>
            </div>
          )}
          <div className="flex flex-row items-center">
            {product.price && (
              <p className="text-darkblue font-semibold text-2xl">
                $ {parseFloat(product.price).toLocaleString('es-AR')}
              </p>
            )}
            <p className="text-darkblue font-normal text-sm ml-1">USD</p>
          </div>


          <a
            href={product.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row justify-center items-center bg-darkblue rounded-2xl hover:bg-hovertext font-semibold w-full h-10 mt-5"
          >
            <p className="text-white">Ver en el Sitio Oficial</p>
            <SquareArrowOutUpRight className="ml-2 h-5 w-5 text-white" />
          </a>
        </div>
      </div>


      {/* Ingredients Section */}
      {product.productIngredients && product.productIngredients.length > 0 && (
        <div className="flex flex-col justify-start items-start bg-rectangles w-[90%] rounded-3xl p-8">
          <div className="w-full flex flex-row justify-start items-center mb-5">
            <FlaskConical className="text-darkblue h-8 w-8 mr-2" strokeWidth={1.5}/>
            <h2 className="text-darkblue font-semibold text-4xl">Ingredientes</h2>
          </div>


          <div className="w-full border-t border-darkblue/60 mb-5"></div>


          {/* Contenedor con scroll */}
          <div className="w-full max-h-[225px] overflow-y-auto pr-2
                scrollbar-thin scrollbar-thumb-darkblue/50 scrollbar-track-[#E2EFEF]/30
                hover:scrollbar-thumb-darkblue/70 transition-colors">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
              {product.productIngredients.map((pi, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl px-4 py-3 text-darkblue text-center text-sm font-medium hover:bg-[#E2EFEF] transition"
                >
                  {pi.ingredient.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}




      {/* Comments Section */}
      <div className="flex flex-col justify-center items-center bg-rectangles w-[90%] rounded-3xl h-full mt-10 mb-5 p-10">
        <div className="flex flex-row justify-center items-center w-full pb-5">
          <div className="flex flex-row justify-start items-start w-1/2">
            <h1 className="text-darkblue font-semibold text-start text-2xl">Comentarios ({comments.length})</h1>
          </div>
          <div className="flex flex-row justify-end items-end w-1/2">
            <button
              onClick={() => {
                if (!user) {
                  navigate("/register");
                } else {
                  setShowCommentForm(!showCommentForm);
                }
              }}
              className="text-darkblue hover:text-hovertext transition"
              title={user ? "Agregar comentario" : "Inicia sesión para comentar"}
            ></button>
            <button 
            onClick={() => {
                if (!user) {
                  navigate("/register");
                } else {
                  setShowCommentForm(!showCommentForm);
                }
              }}
            className="relative group flex h-10 w-10 items-center justify-center">
              <MessageCircle className="absolute top-1 left-1 text-darkblue group-hover:text-hovertext h-8 w-8 transition" />
              <Plus className="absolute top-2.5 left-2.5 text-darkblue group-hover:text-hovertext h-5 w-5 transition" />
            </button>
          </div>
        </div>


        <div className="border-b border-darkblue/60 w-full mb-5"></div>


        {/* Comment Form */}
        {showCommentForm && (
          <form onSubmit={handleSubmitComment} className="bg-[#E2EFEF] rounded-2xl p-5 w-full">
            <div className="w-full flex flex-row justify-between items-center">
              <h3 className="text-darkblue font-bold text-lg mb-3">Agregar Comentario</h3>
              <div className="flex items-center gap-4 mb-3">
                <label className="text-darkblue font-semibold">Calificación:</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="px-4 py-2 rounded-full border border-darkblue focus:outline-none focus:ring-2 focus:ring-darkblue"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>{rating} {rating === 1 ? 'estrella' : 'estrellas'}</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              required
              className="w-full p-3 rounded-xl border border-darkblue focus:outline-none focus:ring-2 focus:ring-darkblue mb-3 scrollbar-thin scrollbar-thumb-darkblue/50 scrollbar-track-[#E2EFEF]/30
                hover:scrollbar-thumb-darkblue/70 transition-colors"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className="px-6 py-2 bg-gray-300 text-darkblue rounded-full hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-hovertext transition disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        )}


        {/* Comments List */}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#E2EFEF] rounded-2xl p-5 w-[90%] my-3">
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-row items-center">
                <div className="flex justify-center items-center h-10 w-10 bg-darkblue rounded-full flex-shrink-0">
                  <UserRound className="h-7 w-7 text-white" />
                </div>
                <div className="flex flex-col ml-5">
                  <h1 className="text-start font-bold text-darkblue text-xl">{comment.user?.name || "Usuario eliminado"}</h1>
                  <p className="text-start text-darkblue/60 font-normal text-sm">
                    {new Date(comment.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-row">
                  {renderStars(comment.rating)}
                </div>
                {(user?.id === comment.user?.id || user?.isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Eliminar comentario"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-start text-darkblue font-normal text-lg ml-14 pt-5 mr-5">
              {comment.content}
            </p>
          </div>
        ))}


        {comments.length === 0 && !showCommentForm && (
          <div className="text-center py-10">
            <p className="text-darkblue/60 mb-4">No hay comentarios todavía</p>
            {user && (
              <button
                onClick={() => setShowCommentForm(true)}
                className="px-6 py-2 bg-darkblue text-white rounded-full hover:bg-hovertext transition"
              >
                Sé el primero en comentar
              </button>
            )}
          </div>
        )}


      </div>
      <Footer />
    </div>
  );
}
