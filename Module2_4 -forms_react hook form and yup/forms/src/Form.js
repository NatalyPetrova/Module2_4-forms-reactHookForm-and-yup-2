import { useRef } from 'react';
import styles from '../src/Form.module.css';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const sendFormData = (formData) => {
	console.log(formData);
};

const fieldsSchema = yup.object().shape({
	email: yup
		.string()
		.matches(
			/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
			'Неверный формат почты',
		),
	password: yup
		.string()
		.matches(
			/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/g,
			'Пароль должен содержать хотя бы одно число, спецсимвол, хотя бы одну латинскую букву в нижнем и верхнем регистрах',
		)
		.min(8, 'Должно быть не менее 8 символов'),
	repeatedPassword: yup
		.string()
		.oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
});

export const Form = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: '',
			password: '',
			repeatedPassword: '',
		},
		resolver: yupResolver(fieldsSchema),
	});

	const submitButtonRef = useRef(null);

	const onSubmit = (formData) => {
		sendFormData(formData);
		submitButtonRef.current.focus();
	};

	return (
		<div className={styles.form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{errors.email && (
					<div className={styles.errorLabel}>{errors.email.message}</div>
				)}
				{errors.password && (
					<div className={styles.errorLabel}>{errors.password.message}</div>
				)}
				{errors.repeatedPassword && (
					<div className={styles.errorLabel}>
						{errors.repeatedPassword.message}
					</div>
				)}
				<input
					name="email"
					type="email"
					placeholder="Почта"
					{...register('email')}
				/>
				<input
					name="password"
					type="password"
					placeholder="Пароль"
					{...register('password')}
				/>
				<input
					name="repeatedPassword"
					type="password"
					placeholder="Повторите пароль"
					{...register('repeatedPassword')}
				/>
				<button
					type="submit"
					ref={submitButtonRef}
					disabled={
						!!errors.email || !!errors.password || !!errors.repeatedPassword
					}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
