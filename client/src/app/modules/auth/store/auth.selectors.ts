import { createFeatureSelector, createSelector } from '@ngrx/store'

import { AuthState } from '../types/auth-store.interfaces'


export const selectAuth = createFeatureSelector<AuthState>('auth')
export const selectIsLoading = createSelector(selectAuth, (state: AuthState) => state.isLoading)
export const selectError = createSelector(selectAuth, (state: AuthState) => state.error)
export const selectTokens = createSelector(selectAuth, (state: AuthState) => state.tokens)
export const selectIsAuthenticated = createSelector(selectAuth, (state: AuthState) => state.isAuthenticated)
