# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :post do
    title "MyString"
    image "MyString"
    user_id 1
    slug "MyString"
    description "MyText"
    views 1
  end
end
