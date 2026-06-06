import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme';

export default function AddRecipeScreen({ navigation }) {
  const { user, userProfile } = useAuthStore();
  const { colors, isDarkMode } = useAppTheme();

  // Basic Info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  // Timing & Difficulty
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('Facile');
  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  // Nutrition
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Arrays
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [utensils, setUtensils] = useState(['']);
  const [steps, setSteps] = useState([{ instruction: '', image: '' }]);

  const [saving, setSaving] = useState(false);

  // Array Handlers
  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  const updateIngredient = (index, field, value) => {
    const newIng = [...ingredients];
    newIng[index][field] = value;
    setIngredients(newIng);
  };
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));

  const addUtensil = () => setUtensils([...utensils, '']);
  const updateUtensil = (index, value) => {
    const newU = [...utensils];
    newU[index] = value;
    setUtensils(newU);
  };
  const removeUtensil = (index) => setUtensils(utensils.filter((_, i) => i !== index));

  const addStep = () => setSteps([...steps, { instruction: '', image: '' }]);
  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!title || !category || !prepTime || !cookTime) {
      Alert.alert("Erreur", "Veuillez remplir les champs obligatoires (Titre, Catégorie, Temps).");
      return;
    }

    setSaving(true);

    try {
      // Clean up arrays
      const cleanedIngredients = ingredients.filter(i => i.name.trim() !== '').map((i, idx) => ({
        id: `i${idx + 1}`,
        name: i.name.trim(),
        amount: parseFloat(i.amount) || 1,
        unit: i.unit.trim() || 'pièce'
      }));

      const cleanedUtensils = utensils.filter(u => u.trim() !== '').map(u => u.trim());

      const cleanedSteps = steps.filter(s => s.instruction.trim() !== '').map((s, idx) => ({
        id: `s${idx + 1}`,
        title: `Étape ${idx + 1}`,
        instruction: s.instruction.trim(),
        image: s.image.trim() || null
      }));

      const totalDuration = (parseInt(prepTime) || 0) + (parseInt(cookTime) || 0);

      const recipeData = {
        title: title.trim(),
        category: category.trim(),
        tags: [category.trim()],
        duration: totalDuration,
        prepTime: parseInt(prepTime) || 0,
        cookTime: parseInt(cookTime) || 0,
        difficulty,
        // Fallback placeholder image if none provided
        image: image.trim() || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
        description: description.trim() || '',
        ingredients: cleanedIngredients,
        utensils: cleanedUtensils,
        steps: cleanedSteps,
        nutrition: {
          calories: parseInt(calories) || 0,
          protein: parseInt(protein) || 0,
          carbs: parseInt(carbs) || 0,
          fat: parseInt(fat) || 0,
        },
        baseServings: 4,
        authorId: user.uid,
        authorName: userProfile?.name || user.email.split('@')[0],
        authorAvatar: userProfile?.avatar || null,
        
        // Zero interactions for new recipes
        views: 0,
        likes: 0,
        cooks: 0,
        reviews: [],
        rating: 0,
        
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'recipes'), recipeData);

      Alert.alert(
        "Succès 🎉", 
        "Votre recette a été publiée avec succès !",
        [{ text: "Génial", onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      console.error("Error adding recipe:", e);
      Alert.alert("Erreur", "Impossible d'enregistrer la recette. Vérifiez votre connexion.");
    } finally {
      setSaving(false);
    }
  };

  const renderSectionTitle = (title, icon) => (
    <View style={styles.sectionTitleContainer}>
      <Ionicons name={icon} size={20} color={colors.primary} style={{ marginRight: 8 }} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Ajouter un plat</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* 1. INFORMATIONS GÉNÉRALES */}
          {renderSectionTitle("Informations Générales", "information-circle")}
          
          <Text style={[styles.label, { color: colors.textSecondary }]}>Titre du plat *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Ex: Poulet DG" placeholderTextColor={colors.textSecondary}
            value={title} onChangeText={setTitle}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Catégorie *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Ex: Africain, Dessert, Healthy..." placeholderTextColor={colors.textSecondary}
            value={category} onChangeText={setCategory}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="Décrivez votre recette, son origine..." placeholderTextColor={colors.textSecondary}
            value={description} onChangeText={setDescription} multiline numberOfLines={3}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>Image (URL) - Laisser vide pour l'image par défaut</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder="https://..." placeholderTextColor={colors.textSecondary}
            value={image} onChangeText={setImage}
          />

          {/* 2. TEMPS ET DIFFICULTÉ */}
          <View style={styles.spacer} />
          {renderSectionTitle("Temps & Difficulté", "time")}

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Préparation (min) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                placeholder="15" placeholderTextColor={colors.textSecondary} keyboardType="numeric"
                value={prepTime} onChangeText={setPrepTime}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Cuisson (min) *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                placeholder="30" placeholderTextColor={colors.textSecondary} keyboardType="numeric"
                value={cookTime} onChangeText={setCookTime}
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.textSecondary }]}>Difficulté</Text>
          <View style={styles.difficultyRow}>
            {difficulties.map(d => (
              <TouchableOpacity 
                key={d} 
                style={[
                  styles.difficultyBtn, 
                  { borderColor: colors.border, backgroundColor: colors.card },
                  difficulty === d && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setDifficulty(d)}
              >
                <Text style={[styles.difficultyText, { color: colors.text }, difficulty === d && { color: '#FFF' }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. NUTRITION */}
          <View style={styles.spacer} />
          {renderSectionTitle("Valeurs Nutritionnelles (par portion)", "leaf")}
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Calories (kcal)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="450" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={calories} onChangeText={setCalories} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Protéines (g)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="25" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={protein} onChangeText={setProtein} />
            </View>
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Glucides (g)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="40" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Lipides (g)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="15" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={fat} onChangeText={setFat} />
            </View>
          </View>

          {/* 4. INGRÉDIENTS */}
          <View style={styles.spacer} />
          {renderSectionTitle("Ingrédients", "restaurant")}
          {ingredients.map((ing, idx) => (
            <View key={idx} style={styles.dynamicRow}>
              <TextInput style={[styles.input, { flex: 2, marginRight: 8, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Nom (ex: Tomate)" placeholderTextColor={colors.textSecondary} value={ing.name} onChangeText={(val) => updateIngredient(idx, 'name', val)} />
              <TextInput style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Qté" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={ing.amount} onChangeText={(val) => updateIngredient(idx, 'amount', val)} />
              <TextInput style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Unité" placeholderTextColor={colors.textSecondary} value={ing.unit} onChangeText={(val) => updateIngredient(idx, 'unit', val)} />
              <TouchableOpacity onPress={() => removeIngredient(idx)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary }]}>Ajouter un ingrédient</Text>
          </TouchableOpacity>

          {/* 5. USTENSILES */}
          <View style={styles.spacer} />
          {renderSectionTitle("Ustensiles", "hammer")}
          {utensils.map((u, idx) => (
            <View key={idx} style={styles.dynamicRow}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]} placeholder="Ex: Poêle, Four..." placeholderTextColor={colors.textSecondary} value={u} onChangeText={(val) => updateUtensil(idx, val)} />
              <TouchableOpacity onPress={() => removeUtensil(idx)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addUtensil} style={styles.addBtn}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary }]}>Ajouter un ustensile</Text>
          </TouchableOpacity>

          {/* 6. ÉTAPES */}
          <View style={styles.spacer} />
          {renderSectionTitle("Étapes de Préparation", "list")}
          {steps.map((step, idx) => (
            <View key={idx} style={[styles.stepContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.stepHeader}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Étape {idx + 1}</Text>
                <TouchableOpacity onPress={() => removeStep(idx)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text, marginBottom: 10 }]} 
                placeholder="Instruction pour cette étape..." placeholderTextColor={colors.textSecondary} 
                value={step.instruction} onChangeText={(val) => updateStep(idx, 'instruction', val)} multiline numberOfLines={3} 
              />
              <TextInput 
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} 
                placeholder="URL de l'image (Optionnel)" placeholderTextColor={colors.textSecondary} 
                value={step.image} onChangeText={(val) => updateStep(idx, 'image', val)} 
              />
            </View>
          ))}
          <TouchableOpacity onPress={addStep} style={styles.addBtn}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary }]}>Ajouter une étape</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: saving ? 0.6 : 1 }]} 
            onPress={handleSave} disabled={saving}
          >
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Publier la recette premium</Text>}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  title: { fontSize: 20, fontWeight: '800' },
  form: { paddingHorizontal: 20, paddingTop: 10 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  spacer: { height: 30 },
  row: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, fontSize: 15 },
  textArea: { height: 80, textAlignVertical: 'top' },
  difficultyRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  difficultyBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  difficultyText: { fontWeight: '700', fontSize: 14 },
  dynamicRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  removeBtn: { padding: 5 },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, justifyContent: 'center', borderWidth: 1, borderColor: 'transparent', borderStyle: 'dashed', borderRadius: 10 },
  addBtnText: { fontWeight: 'bold', marginLeft: 5 },
  stepContainer: { borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 15 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stepTitle: { fontWeight: 'bold', fontSize: 16 },
  submitBtn: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 20, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});
