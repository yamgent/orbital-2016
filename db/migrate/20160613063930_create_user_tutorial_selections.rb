class CreateUserTutorialSelections < ActiveRecord::Migration
  def change
    create_table :user_tutorial_selections do |t|
      t.belongs_to :user, index: true
      t.belongs_to :tutorial, index: true

      t.integer :rank

      t.timestamps null: false
    end
  end
end
