class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :image
      t.integer :user_id
      t.string :slug
      t.text :description
      t.integer :views

      t.timestamps
    end
  end
end
