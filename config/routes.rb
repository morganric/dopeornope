Rails.application.routes.draw do
  resources :posts

  resources :votes


  post "/posts/:id/dope" => "posts#dope", :as => "dope", via: [:get, :post]
  post "/posts/:id/nope" => "posts#nope", :as => "nope", via: [:get, :post]

  mount Upmin::Engine => '/admin'
  root to: 'posts#index'
  devise_for :users
  resources :users
end
