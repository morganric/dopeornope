Rails.application.routes.draw do
  
  mount Payola::Engine => '/payola', as: :payola
  resources :posts
  resources :votes
  resources :charges

  post "/posts/:id/dope" => "posts#dope", :as => "dope", via: [:get, :post]
  post "/posts/:id/nope" => "posts#nope", :as => "nope", via: [:get, :post]

  mount Upmin::Engine => '/admin'
  root to: 'posts#index'
   devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks"}
  # devise_for :users
  resources :users
end
