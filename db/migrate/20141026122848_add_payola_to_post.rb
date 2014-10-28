class AddPayolaToPost < ActiveRecord::Migration
  def change
    add_column :posts, :price, :integer
    add_column :posts, :name, :string
    add_column :posts, :permalink, :string
  end
end
