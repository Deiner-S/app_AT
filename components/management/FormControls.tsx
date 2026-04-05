import { Picker } from '@react-native-picker/picker';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export type FormSelectOption = string | {
  label: string;
  value: string;
};

export function FormField({
  label,
  error,
  multiline = false,
  ...props
}: TextInputProps & { label: string; error?: string; multiline?: boolean }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError, props.style]}
        placeholderTextColor="#64748b"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{value || '-'}</Text>
      </View>
    </View>
  );
}

export function FormSelect({
  label,
  value,
  error,
  options,
  onValueChange,
  emptyOptionLabel = 'Selecione uma opcao',
  textColor = '#e2e8f0',
  optionTextColor = '#e2e8f0',
  backgroundColor = 'rgba(15, 23, 42, 0.82)',
}: {
  label: string;
  value: string;
  error?: string;
  options: readonly FormSelectOption[];
  onValueChange: (value: string) => void;
  emptyOptionLabel?: string;
  textColor?: string;
  optionTextColor?: string;
  backgroundColor?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.selectWrap, { backgroundColor }, error && styles.inputError]}>
        <Picker
          selectedValue={value}
          onValueChange={(nextValue) => onValueChange(String(nextValue))}
          dropdownIconColor={textColor}
          style={[styles.select, { color: textColor }]}
        >
          {options.map((option) => {
            const normalized = typeof option === 'string'
              ? { label: option || emptyOptionLabel, value: option }
              : option;

            return (
            <Picker.Item
              key={normalized.value || 'empty-option'}
              label={normalized.label}
              value={normalized.value}
              color={optionTextColor}
            />
            );
          })}
        </Picker>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function FormActions({
  submitLabel,
  onSubmit,
  submitting = false,
}: {
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  return (
    <Pressable style={[styles.submitButton, submitting && styles.submitButtonDisabled]} onPress={onSubmit} disabled={submitting}>
      <Text style={styles.submitButtonText}>{submitting ? 'Salvando...' : submitLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    color: '#f8fafc',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'rgba(248, 113, 113, 0.75)',
  },
  readOnlyBox: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  readOnlyText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  selectWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  select: {
    color: '#e2e8f0',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    marginTop: 6,
  },
  submitButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#0f766e',
    marginTop: 6,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 15,
  },
});
