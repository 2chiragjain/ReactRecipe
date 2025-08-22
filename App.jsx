// App.jsx
// Single-file React Recipe App (Tailwind-ready)
// Default export: App

import React, { useState, useEffect } from "react";

// --- Helper utilities ---
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const sampleRecipes = [
  {
    id: uid(),
    title: "Classic Pancakes",
    tags: ["breakfast", "easy"],
    servings: 4,
    time: "20 min",
    ingredients: [
      "1 1/2 cups all-purpose flour",
      "3 1/2 tsp baking powder",
      "1 tsp salt",
      "1 tbsp sugar",
      "1 1/4 cups milk",
      "1 egg",
      "3 tbsp melted butter",
    ],
    steps: [
      "Whisk dry ingredients.",
      "Add milk, egg and melted butter — stir until just combined.",
      "Heat a skillet and cook 2-3 minutes per side until golden.",
    ],
    favorite: false,
    image: null,
  },
  {
    id: uid(),
    title: "Simple Tomato Pasta",
    tags: ["dinner", "vegetarian"],
    servings: 2,
    time: "25 min",
    ingredients: ["200g pasta", "2 cups chopped tomatoes", "2 cloves garlic", "olive oil", "salt & pepper", "basil"],
    steps: ["Cook pasta according to package.", "Sauté garlic in olive oil, add tomatoes and simmer.", "Toss pasta with sauce and garnish with basil."],
    favorite: true,
    image: null,
  },
];

// LocalStorage key
const LS_KEY = "react_recipe_app_v1";

// --- Components ---
function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search recipes..."
      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring"
    />
  );
}

function Tag({ text, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="text-xs px-2 py-1 mr-2 mb-2 bg-gray-100 rounded-full hover:bg-gray-200"
    >
      {text}
    </button>
  );
}

function RecipeCard({ recipe, onView, onEdit, onDelete, toggleFavorite }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-gray-500">No Image</span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{recipe.title}</h3>
            <button onClick={() => toggleFavorite(recipe.id)} title="Toggle favorite">
              {recipe.favorite ? "★" : "☆"}
            </button>
          </div>
          <p className="text-sm text-gray-500">{recipe.time} • {recipe.servings} servings</p>
          <div className="mt-2">
            {recipe.tags?.map((t) => (
              <span key={t} className="text-xs mr-2 px-2 py-1 bg-gray-100 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => onView(recipe)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">View</button>
        <button onClick={() => onEdit(recipe)} className="px-3 py-1 rounded bg-amber-400 text-sm">Edit</button>
        <button onClick={() => onDelete(recipe.id)} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Delete</button>
      </div>
    </div>
  );
}

function RecipeForm({ initial = null, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [servings, setServings] = useState(initial?.servings || "");
  const [time, setTime] = useState(initial?.time || "");
  const [ingredients, setIngredients] = useState((initial?.ingredients || []).join("\n"));
  const [steps, setSteps] = useState((initial?.steps || []).join("\n"));
  const [image, setImage] = useState(initial?.image || null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    const recipe = {
      id: initial?.id || uid(),
      title: title.trim() || "Untitled",
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      servings: Number(servings) || 1,
      time: time || "",
      ingredients: ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
      favorite: initial?.favorite || false,
      image,
    };
    onSave(recipe);
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Servings</label>
          <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g. 30 min" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input type="file" accept="image/*" onChange={handleFile} className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients (one per line)</label>
        <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Steps (one per line)</label>
        <textarea value={steps} onChange={(e) => setSteps(e.target.value)} rows={5} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
      </div>
    </form>
  );
}

function RecipeView({ recipe, onClose, onEdit }) {
  if (!recipe) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded shadow p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          <div className="flex gap-2">
            <button onClick={() => onEdit(recipe)} className="px-3 py-1 rounded bg-amber-400">Edit</button>
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200">Close</button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1">{recipe.time} • {recipe.servings} servings</p>

        <div className="mt-4">
          {recipe.image && <img src={recipe.image} alt="recipe" className="w-full rounded-md max-h-80 object-cover" />}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Ingredients</h3>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Steps</h3>
            <ol className="list-decimal ml-5 mt-2 text-sm">
              {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium">Tags</h4>
          <div className="mt-2">
            {recipe.tags.map(t => <span key={t} className="text-xs mr-2 px-2 py-1 bg-gray-100 rounded-full">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [recipes, setRecipes] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return sampleRecipes;
  });

  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [viewRecipe, setViewRecipe] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(recipes));
  }, [recipes]);

  function createRecipe() {
    setEditing(null);
    setShowForm(true);
  }

  function saveRecipe(r) {
    setRecipes(prev => {
      const exists = prev.find(p => p.id === r.id);
      if (exists) return prev.map(p => p.id === r.id ? r : p);
      return [r, ...prev];
    });
    setShowForm(false);
    setEditing(null);
    setViewRecipe(r);
  }

  function editRecipe(r) {
    setEditing(r);
    setShowForm(true);
  }

  function deleteRecipe(id) {
    if (!confirm("Delete this recipe?")) return;
    setRecipes(prev => prev.filter(r => r.id !== id));
    if (viewRecipe?.id === id) setViewRecipe(null);
  }

  function toggleFavorite(id) {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  }

  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags || []))).sort();

  const filtered = recipes.filter(r => {
    const q = query.trim().toLowerCase();
    if (q) {
      const hay = (r.title + ' ' + (r.tags || []).join(' ') + ' ' + (r.ingredients||[]).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (tagFilter) {
      if (!r.tags || !r.tags.includes(tagFilter)) return false;
    }
    return true;
  }).sort((a,b)=> (b.favorite === a.favorite) ? a.title.localeCompare(b.title) : (b.favorite?1:-1));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Recipe Box</h1>
            <p className="text-sm text-gray-600">Personal recipe manager — search, create, edit, and favourite.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={createRecipe} className="px-4 py-2 rounded bg-emerald-600 text-white">New Recipe</button>
            <div className="text-sm text-gray-500">Saved: {recipes.length}</div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="md:col-span-1 space-y-4">
            <div>
              <SearchBar value={query} onChange={setQuery} />
            </div>

            <div className="bg-white p-3 rounded shadow">
              <h4 className="font-semibold mb-2">Filters</h4>
              <div className="mb-2">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setTagFilter("")} className={`px-3 py-1 rounded ${tagFilter? 'bg-gray-100' : 'bg-indigo-600 text-white'}`}>All</button>
                  <button onClick={() => setTagFilter("favorite")} className={`px-3 py-1 rounded ${tagFilter==='favorite'? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Favorites</button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium">Tags</h5>
                <div className="mt-2">
                  {allTags.length === 0 && <div className="text-sm text-gray-500">No tags yet</div>}
                  <div className="mt-2 flex flex-wrap">
                    {allTags.map(t => <button key={t} onClick={() => setTagFilter(t)} className={`px-2 py-1 mr-2 mb-2 rounded ${tagFilter===t? 'bg-indigo-600 text-white':'bg-gray-100'}`}>{t}</button>)}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">Hint: click a tag to filter or use the search box.</div>
            </div>

            <div className="bg-white p-3 rounded shadow">
              <h4 className="font-semibold mb-2">Quick actions</h4>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(recipes)); alert('Recipes copied to clipboard (JSON).'); }} className="px-3 py-1 rounded bg-gray-200">Copy JSON</button>
                <button onClick={() => { localStorage.removeItem(LS_KEY); setRecipes(sampleRecipes); alert('Reset to sample recipes'); }} className="px-3 py-1 rounded bg-red-100">Reset</button>
              </div>
            </div>

          </aside>

          <main className="md:col-span-2 space-y-4">
            {showForm && (
              <RecipeForm initial={editing} onSave={saveRecipe} onCancel={() => { setShowForm(false); setEditing(null); }} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 p-8 bg-white rounded shadow">No recipes found — create your first one!</div>
              ) : (
                filtered.map(r => (
                  <RecipeCard key={r.id} recipe={r} onView={setViewRecipe} onEdit={editRecipe} onDelete={deleteRecipe} toggleFavorite={toggleFavorite} />
                ))
              )}
            </div>

          </main>
        </section>

        {viewRecipe && <RecipeView recipe={viewRecipe} onClose={() => setViewRecipe(null)} onEdit={(r) => { setEditing(r); setShowForm(true); setViewRecipe(null); }} />}
      </div>
    </div>
  );
}
