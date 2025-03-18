<script setup lang="ts">
import { useFormValidation } from '../composable/useFormValidation';
import { useHttp } from '../composable/useHttp';
import { ref } from 'vue';

// Определяем схему формы с правилами валидации
const formSchema = {
    email: {
        value: '',
        rules: [
            (value: string) => !!value || 'Email обязателен',
            (value: string) => /\S+@\S+\.\S+/.test(value) || 'Некорректный email',
        ],
    },
    password: {
        value: '',
        rules: [
            (value: string) => !!value || 'Пароль обязателен',
            (value: string) => value.length >= 6 || 'Минимум 6 символов',
        ],
    },
};

// Используем валидацию
const { form, errors, validateField, validateForm, isFormValid } = useFormValidation(formSchema);

// Используем HTTP-запросы
const { data, loading, error, fetchData } = useHttp();

// Функция отправки формы
const submitForm = async () => {
    if (!validateForm()) return; // Проверяем валидацию перед отправкой

    await fetchData({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        body: { email: form.value.email, password: form.value.password },
    });
};
</script>

<template>
    <form @submit.prevent="submitForm">
        <div>
            <label>Email</label>
            <input v-model="form.email" @blur="validateField('email')" type="email" />
            <p v-if="errors.email">{{ errors.email }}</p>
        </div>

        <div>
            <label>Password</label>
            <input v-model="form.password" @blur="validateField('password')" type="password" />
            <p v-if="errors.password">{{ errors.password }}</p>
        </div>

        <button type="submit" :disabled="!isFormValid || loading">Submit</button>
    </form>

    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="data">Response: {{ data }}</div>
</template>

<style scoped>
input {
    margin-bottom: 10px;
}
p {
    color: red;
}
</style>