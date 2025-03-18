import { ref, computed } from 'vue';

interface ValidationRule {
    (value: any): string | boolean;
}

interface FormField {
    value: any;
    rules?: ValidationRule[];
}

interface FormSchema {
    [key: string]: FormField;
}

export function useFormValidation(formSchema: FormSchema) {
    const form = ref<Record<string, any>>({});
    const errors = ref<Record<string, string | null>>({});

    // Инициализация формы
    Object.keys(formSchema).forEach((key) => {
        form.value[key] = formSchema[key].value;
        errors.value[key] = null;
    });

    // Функция валидации поля
    const validateField = (key: string) => {
        const field = formSchema[key];
        if (!field.rules) return;

        for (const rule of field.rules) {
            const validationResult = rule(form.value[key]);
            if (typeof validationResult === 'string') {
                errors.value[key] = validationResult;
                return false;
            }
        }
        errors.value[key] = null;
        return true;
    };

    // Валидация всей формы
    const validateForm = () => {
        let isValid = true;
        Object.keys(formSchema).forEach((key) => {
            if (!validateField(key)) {
                isValid = false;
            }
        });
        return isValid;
    };

    // Состояние валидности формы
    const isFormValid = computed(() => {
        return Object.values(errors.value).every((error) => error === null);
    });

    return { form, errors, validateField, validateForm, isFormValid };
}
